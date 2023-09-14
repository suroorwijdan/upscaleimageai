import {createServerActionClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(request) {
    const supabase = createServerActionClient({cookies})
    const {data, error} = await supabase
        .from('generations')
        .select();

    return NextResponse.json(data);
}
