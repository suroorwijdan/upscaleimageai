"use server";

import {stripe} from "@/lib/stripe";
import {Badge} from "@/components/ui/badge";
import {CheckIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {createCheckoutSession} from "@/app/actions/checkout";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";

export default async function PricingPage() {
    const supabase = createServerActionClient({cookies})
    const {data: {user}} = await supabase.auth.getUser();
    const {data: profile} = await supabase.from('users').select().eq('user_id', user.id).single();
    const {data: products = []} = await stripe.products.list();

    return (
        <div className="container mx-auto mt-20">

            <div className='flex-col justify-center items-center w-full'>
                <div
                    className='text-center whitespace-pre-wrap w-1/1 text-5xl font-medium tracking-tighter text-black dark:text-white mb-10'>
                    Buy UpscaleImage credits
                </div>

                <div
                    className="text-center whitespace-pre-wrap text-xl tracking-tighter text-gray-400 dark:text-white mt-10">
                    You have {profile.credits} credits remaining. Join 100+ happy customers by buying more credits below.
                </div>
            </div>


            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-10'>
                {products.reverse().map(product => <Card
                    key={product.id}
                    className="flex w-full cursor-pointer flex-col overflow-hidden"
                >
                    <CardHeader>
                        {product.metadata.credits === '50' ? <div>
                            <Badge>Most commonly bought</Badge>
                        </div> : <div>
                            <Badge variant='outline'></Badge>
                        </div>}
                    </CardHeader>
                    <CardContent>
                        <p className="z-10 whitespace-nowrap text-2xl font-medium text-gray-800 dark:text-gray-200">
                            {product.name}
                        </p>

                        <p className="z-10 text-md font-medium text-gray-800 dark:text-gray-200">
                            {product.description}
                        </p>

                        <p className="z-10 text-4xl font-medium text-gray-800 dark:text-gray-200 mt-7">
                            US${parseFloat(product.metadata.price).toFixed(2)}
                        </p>

                        <form action={createCheckoutSession}>
                            <input hidden name='productId' defaultValue={product.id}/>
                            <Button type='submit' variant='' className='mt-10 w-full'> Pay </Button>
                        </form>
                    </CardContent>
                </Card>)}
            </div>

            <div className='mt-10 flex-col justify-center items-center'>
                <p className='text-center whitespace-pre-wrap w-1/1 text-4xl font-medium tracking-tighter text-black dark:text-white mb-10'>
                    What&apos;s included
                </p>

                <div className='flex justify-center'>
                    <div className='grid grid-cols-1 md:grid-cols-2 w-full md:w-[calc(100vw-30%)]'>
                        <div className=''>
                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <p>Access to new upcoming features</p>
                            </div>

                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <p>Ability to retain images for longer on account</p>
                            </div>

                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <div>Generate HD images through prompt <Badge>Coming soon</Badge></div>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <p>Troubleshooting/Help through email</p>
                            </div>

                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <p>Request features or integrations for your personal or business use</p>
                            </div>

                            <div className='flex items-center mb-3'>
                                <CheckIcon className='h-7 w-7 mr-2'/>
                                <div>Image to Image generation through prompts <Badge>Coming soon</Badge></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-center mt-20 mb-10'>
                <p>
                    For any questions email suroor.w@upscaleimage.ai
                </p>
            </div>
        </div>
    )
}
