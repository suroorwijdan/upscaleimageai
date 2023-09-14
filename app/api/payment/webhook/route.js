import {NextResponse} from 'next/server'
import {stripe} from '@/lib/stripe'
import {createClient} from '@supabase/supabase-js'

export async function POST(req) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {persistSession: false},
    })
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get('stripe-signature'),
            process.env.STRIPE_WEBHOOK_SECRET,
        )
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.log(`❌ Error message: ${errorMessage}`)
        return NextResponse.json(
            {message: `Webhook Error: ${errorMessage}`},
            {status: 400}
        )
    }


    if (event.type === 'checkout.session.completed') {
        let data = event.data.object;
        const {metadata} = data;
        console.log('✅ Event:', event.id)
        console.log(`💰 CheckoutSession status: ${data.payment_status}`)

        // get profile
        const {data: profile} = await supabase.from('users').select().eq('user_id', data.client_reference_id).select().single();

        console.log(profile);

        // add credits to the account
        const {data: creditResponse, error: creditErrorResponse} = await supabase.from('users').update({
            credits: profile.credits + parseInt(metadata.credits)
        }).eq('user_id', data.client_reference_id).select().single()

        console.log('✅ Credits added:', creditResponse);
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({message: 'Received'}, {status: 200})
}
