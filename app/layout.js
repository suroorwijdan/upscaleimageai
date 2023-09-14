import './globals.css'
import {Inter} from 'next/font/google'
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toaster";
import Script from "next/script";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'UpscaleImage.AI - All things images and AI',
    description: 'All things images and AI',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
        </ThemeProvider>
        <Toaster/>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2EE2QLLS0E"/>
        <Script id="google-analytics">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-2EE2QLLS0E');
        `}
        </Script>
        </body>
        </html>
    )
}
