"use client";

import {MainNav} from "@/components/main-nav";
import {UserNav} from "@/components/user-nav";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function AccountLayout({children}) {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [user, setUser] = useState({});

    useEffect(() => {
        //check session
        (async () => {
            const session = await checkSession();
            if (!session) {
                router.push('/');
            }
        })();


        fetchUserFromSession();
    }, [])

    const fetchUserFromSession = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if (user) {
            const {data} = await supabase.from('users').select().eq('user_id', user.id).single();
            user.profile = data;
            setUser(user);
        }
    }

    const checkSession = async () => {
        const {data: {session}} = await supabase.auth.getSession();
        return session;
    }

    const onLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    }

    return (
        <>
            <div className="flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <p className='tracking-tighter text-xl'>UpscaleImage.AI</p>
                        <MainNav className="mx-6"/>
                        <div className="ml-auto flex items-center space-x-4">
                            <UserNav user={user} onLogout={onLogout}/>
                        </div>
                    </div>
                </div>
            </div>

            {children}

            <div
                className='w-full text-black dark:text-white py-10 px-10 border-t border-gray-300 dark:border-gray-900 flex flex-row justify-between text-gray-500'>
                <div>
                    Powered by Vercel, Replicate and Tailwind
                </div>
                <div>
                    Brought to you by <a href="https://twitter.com/suroorwijdan" target="_blank" className='underline'>Suroor
                    Wijdan</a>
                </div>
            </div>
        </>
    )
}
