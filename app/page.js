"use-client";

import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {ImageIcon} from "@radix-ui/react-icons";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {ReviewCard} from "@/components/review-card";

export default function Home() {
    const reviews = [
        {
            name: "Nikhil Chainani",
            username: "@nikhilc",
            body: "This is great. Works like a charm. Looking forward to the updates",
            img: "/1686387075588.jpeg",
        },
        {
            name: "Girish Gandhi",
            username: "@girish",
            body: "Amazing tech. Congrats!",
            img: "/1689332966195.jpeg",
        },
        {
            name: "Chetanya",
            username: "@chetanya",
            body: "Love the concept. Promising!",
            img: "/1692275079257.jpeg",
        },
    ];

    return (
        <div>
            <div className="h-full relative bg-blue">
                <div className='container mx-auto flex flex-col items-center'>
                    <div className='flex flex-row items-center justify-between w-full pt-10'>
                        <div className='text-2xl font-medium tracking-tighter text-black dark:text-white'>
                            <Link href='/'>
                                UpscaleImage.AI
                            </Link>
                        </div>
                        <div className='text-2xl font-medium tracking-tighter text-black dark:text-white'>
                            <Link href="/authentication">
                                <Button variant="outline">Login</Button>
                            </Link>
                        </div>
                    </div>

                    <div
                        className='text-center whitespace-pre-wrap w-1/1 text-4xl md:text-8xl font-medium tracking-tighter text-black dark:text-white mt-40'>
                        Bring your old photos back to life with AI
                    </div>

                    <div
                        className="text-center whitespace-pre-wrap text-sm md:text-xl tracking-tighter text-gray-400 dark:text-white mt-10 md:w-1/2">
                        Upload your old, damaged, blurry or noisy photos and get a clean upscaled image in minutes.
                        Join happy customers experiencing the power of AI.
                    </div>

                    <div className='mt-10'>
                        <Link href='/authentication'>
                            <Button size='lg' variant="outline">
                                <ImageIcon className="mr-2 h-4 w-4"/> Upload your image
                            </Button>
                        </Link>
                    </div>

                    <div className='border-t border-gray-100 mt-20 mb-20 w-full'>
                        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
                            <div className=''>
                                <p className='text-center pb-4 font-medium tracking-tighter text-black dark:text-white'>Original
                                    Image</p>
                                <AspectRatio ratio={16 / 9}>
                                    <Image src="/pre-example-1.jpeg" alt="Image" fill='contain'
                                           className="rounded-md object-cover"/>
                                </AspectRatio>
                            </div>
                            <div className=''>
                                <p className='text-center pb-4 font-medium tracking-tighter text-black dark:text-white'>Upscaled
                                    Image</p>
                                <AspectRatio ratio={16 / 9}>
                                    <Image src="/post-example-1.png" alt="Image" fill='contain'
                                           className="rounded-md object-cover"/>
                                </AspectRatio>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className='w-full text-black dark:text-white py-10 px-10 border-t border-gray-300 dark:border-gray-900 flex flex-row justify-between text-gray-500'>
                    <div>
                        Powered by Vercel, Replicate and Tailwind
                    </div>
                    <div>
                        Brought to you by <a href="https//twitter.com/suroorwijdan" className='underline'>Suroor
                        Wijdan</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
