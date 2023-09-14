import {createRouteHandlerClient, createServerActionClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
});

export const dynamic = 'force-dynamic'

export async function POST(request) {
    const payload = await request.json();
    const dbPayload = {
        original_image_url: payload.originalImage,
        generated_image_url: '',
        status: 'CREATED',
        task_type: payload.taskType,
        completed_at: null,
    }

    const supabase = createServerActionClient({cookies});

    // get user session
    const {data: {user}} = await supabase.auth.getUser();

    // get user public profile
    const {data: userProfile} = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id).select().single();

    if (userProfile.credits <= 0) {
        return NextResponse.json({
            code: '1231',
            error: 'You do not have enough credits. Please buy a credits package.'
        }, {status: 403});
    }


    // create process record
    const {data, error} = await supabase
        .from('generations')
        .insert(dbPayload)
        .select().single()

    if (error) {
        return NextResponse.json(error);
    }

    // get public signed url for image
    const {data: signedURLResponse, error: signedURLError} = await supabase
        .storage
        .from('user-images')
        .createSignedUrl(payload.originalImage, 60 * 30)

    // initiate prediction process
    const prediction = await replicate.predictions.create({
        version: process.env.AI_MODEL,
        input: {
            image: signedURLResponse.signedUrl
        },
        webhook: `${process.env.WEBHOOK_BASE_URL}/api/process/webhook`,
        webhook_events_filter: ["completed"]
    });

    console.log(prediction);

    // update generation record
    const {data: updatedDBResponse, error: updatedDBError} = await supabase
        .from('generations')
        .update({
            generation_id: prediction.id,
            status: prediction.status.toUpperCase(),
            ai_model_version: prediction.version
        })
        .eq('id', data.id).select().single();

    // minus one credit
    const {data: creditResponse, error: creditErrorResponse} = await supabase
        .from('users')
        .update({
            credits: userProfile.credits - 1
        })
        .eq('user_id', data.user_id).select().single();

    console.log('Credits updated', creditResponse);

    return NextResponse.json(updatedDBResponse);
}
