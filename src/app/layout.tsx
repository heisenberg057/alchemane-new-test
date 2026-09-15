import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import Script from "next/script";

import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeferredAnalyticsTracker } from "@/components/layout/DeferredAnalyticsTracker";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/StructuredData";
import { TrackingProvider } from "@/providers/TrackingProvider";
import { LeadOptimizationProvider } from "@/components/lead-optimization/LeadOptimizationProvider";
import { DeferredFloatingContactWidget } from "@/components/layout/DeferredFloatingContactWidget";

import { defaultSEO } from "@/config/seo.config";

export const metadata: Metadata = defaultSEO;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx("min-h-screen bg-white font-sans antialiased")}>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <>
            <Script
              id="facebook-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element -- Facebook Pixel noscript fallback; must be a raw <img> per Meta spec */}
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        <Providers>
          <TrackingProvider>
            <LeadOptimizationProvider>
              <OrganizationSchema />
              <WebsiteSchema />
              <DeferredAnalyticsTracker />
              <Header />
              <main className="min-h-[calc(100vh-64px)]">
                {children}
              </main>
              <Footer />
              <DeferredFloatingContactWidget />
            </LeadOptimizationProvider>
          </TrackingProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
