import Link from "next/link"
import {cn} from "@/lib/utils"
import {UserAuthForm} from "@/app/authentication/user-auth-form";
import {cookies} from "next/headers";
import { createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import * as React from "react";

export const metadata = {
    title: "UpscaleImage",
    description: "UpscaleImage Authentication",
}

export default async function AuthenticationPage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    })

    const {data} = await supabase.auth.getUser();
    const {user = {}} = data;
    const {user_metadata = {}} = user || {};

    return (
        <div className=''>
            <div className="container mx-auto">
                <div className='flex flex-row items-center justify-between w-full pt-10 mb-10'>
                    <div className='text-2xl font-medium tracking-tighter text-black dark:text-white'>
                        <Link href='/'>
                            UpscaleImage.AI
                        </Link>
                    </div>

                    <div
                        className='text-sm font-medium tracking-tighter text-black dark:text-white flex flex-row justify-between items-center'>
                        {user_metadata.full_name}
                        {
                            user_metadata.avatar_url ?
                                <Image className="rounded-full ml-2" width="32" height="32" alt=""
                                       src={user_metadata.avatar_url}/> : ''
                        }
                    </div>
                </div>
            </div>
            <div
                className="container flex-col items-center justify-center md:grid lg:max-w-none lg:px-0 h-[calc(100vh-100px)]">
                <div className="lg:p-8">
                    <div
                        className='text-center whitespace-pre-wrap w-1/1 text-5xl font-medium tracking-tighter text-black dark:text-white mb-10'>
                        {user_metadata.full_name ? `Welcome back, ${user_metadata.full_name}` : 'Bring your old photos back to life with AI'}
                    </div>
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {user_metadata && user_metadata.full_name ? <div className={cn("grid gap-6")}>
                            <Link href='/account'>
                                <Button variant="default" type="button" className='w-full'>
                                    Go to your account
                                </Button>
                            </Link>
                        </div> : <div>
                            <div className="flex flex-col space-y-2 text-center pb-5">
                                <p className="text-md text-muted-foreground">
                                    Sign in with Google below to create your free account in seconds. You will get 3
                                    image
                                    generations free.
                                </p>
                            </div>
                            <UserAuthForm/>
                            <p className='px-8 py-5 text-center text-sm text-muted-foreground'>
                                Important: We do no sell or share your data or images with any one.
                            </p>
                        </div>}

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By signing in, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
