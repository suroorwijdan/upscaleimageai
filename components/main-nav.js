import Link from "next/link"
import {cn} from "@/lib/utils"

export function MainNav({className, ...props}) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/account"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Account
            </Link>
            <Link
                href="/account/pricing"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Pricing
            </Link>
        </nav>
    )
}
