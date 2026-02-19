'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const TrackPageViews = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', 'G-BXPXP6GWYK', {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
};

const GoogleAnalytics = () => {
    return (
        <>
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
            <Suspense fallback={null}>
                <TrackPageViews />
            </Suspense>
        </>
    );
};

export default GoogleAnalytics;
