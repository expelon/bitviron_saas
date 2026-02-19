import type { Metadata } from "next";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleAnalytics from "../components/GoogleAnalytics";

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
                <GoogleAnalytics />
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
