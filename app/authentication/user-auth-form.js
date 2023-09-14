"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";


export function UserAuthForm({className, ...props}) {
    const [isLoading, setIsLoading] = React.useState(false)
    const supabase = createClientComponentClient();

    async function onSubmit(event) {
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: `${window.location.origin}/api/auth/callback`
            },
        })
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Button variant="default" type="button" disabled={isLoading} onClick={onSubmit}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                ) : (
                    <Icons.google className="mr-2 h-4 w-4"/>
                )}{" "}
                Sign in with Google
            </Button>
        </div>
    )
}
