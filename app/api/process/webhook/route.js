import {NextResponse} from 'next/server'
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import {createClient} from '@supabase/supabase-js'
import {v4 as uuidv4} from "uuid";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    const payload = await request.json();

    const response = await fetch(payload.output);
    const output_image = await response.blob();


    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {persistSession: false},
    })

    const {data: generation} = await supabase
        .from('generations')
        .select()
        .eq('generation_id', payload.id).select().single();

    console.log(generation);

    const extension = payload.output.split('.').pop();
    const {data, error} = await supabase
        .storage
        .from('user-images')
        .upload(`${generation.user_id}/${uuidv4()}.${extension}`, output_image);

    // update in database
    const dbPayload = {
        generated_image_url: data.path,
        status: payload.status.toUpperCase(),
        completed_at: payload.completed_at,
        generation_error: payload.error || null,
        processing_time: payload.metrics.predict_time
    }

    const {data: updatedDBResponse, error: updatedDBError} = await supabase
        .from('generations')
        .update(dbPayload)
        .eq('generation_id', payload.id).select().single();

    console.log("Webhook", updatedDBResponse, updatedDBError);

    return NextResponse.json({});
}
