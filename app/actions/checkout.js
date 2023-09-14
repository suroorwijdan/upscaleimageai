'use server';

import {redirect} from "next/navigation";
import {stripe} from "@/lib/stripe";
import {cookies, headers} from "next/headers";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";

export async function createCheckoutSession(data) {
    const supabase = createServerActionClient({cookies})
    const {data: {user}} = await supabase.auth.getUser();
    const product = await stripe.products.retrieve(data.get('productId'));
    const price = await stripe.prices.retrieve(product.default_price);

    const checkoutSession =
        await stripe.checkout.sessions.create({
            mode: 'payment',
            submit_type: 'pay',
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: price.unit_amount,
                    },
                },],
            success_url: `${headers().get('origin')}/account/pricing?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${headers().get('origin')}/account/pricing`,
            client_reference_id: user.id,
            customer_email: user.email,
            metadata: {credits: product.metadata.credits}
        })

    redirect(checkoutSession.url);
}
