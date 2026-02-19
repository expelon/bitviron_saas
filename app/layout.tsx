import type { Metadata } from "next";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
    weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
    title: "Bitviron | Digital Tools Platform",
    description: "All-in-one digital workspace",
    icons: {
        icon: "/bitviron-logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${plusJakartaSans.variable} antialiased bg-white`}
            >
                {/* Google Tag (gtag.js) */}
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-BXPXP6GWYK"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-BXPXP6GWYK');
                    `}
                </Script>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
