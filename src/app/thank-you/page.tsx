import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

import { sanitizeThankYouText } from "@/lib/thankYou";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";

type ThankYouPageProps = {
  searchParams?: Promise<{
    fname?: string | string[];
    tel?: string | string[];
  }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Thank You | American Hairline",
  description: "Your request has been received by American Hairline.",
  canonical: "/thank-you",
  robots: { index: false, follow: false },
  fallbackTitle: "Thank You | American Hairline",
  fallbackDescription: "Your request has been received by American Hairline.",
});


function firstValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const name = sanitizeThankYouText(firstValue(resolvedSearchParams.fname)) || "there";
  const phone = sanitizeThankYouText(firstValue(resolvedSearchParams.tel));

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-5 pb-16 pt-28 md:min-h-[calc(100vh-88px)] md:px-10 md:pt-36 xl:px-[160px]">
      <div className="flex w-full max-w-[960px] flex-col items-center text-center">
        <h1 className="text-[56px] font-extrabold uppercase leading-[1] tracking-[-1.5px] text-[#357BC6] md:text-[96px]">
          Thank You
        </h1>

        <p className="mt-5 text-[28px] font-extrabold leading-[1.15] tracking-[-0.5px] text-[#121212] md:mt-6 md:text-[48px]">
          Hi {name},
        </p>

        <div className="mt-5 max-w-[720px] text-center text-[18px] leading-[1.55] tracking-[-0.1px] text-[#121212] md:mt-6 md:text-[22px]">
          <p>Thank you for contacting us.</p>
          <p>
            {phone
              ? <>we will contact you soon on your phone number <span className="font-bold">{phone}</span>. Stay tuned.</>
              : <>We will contact you shortly. Stay tuned.</>}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex h-[44px] items-center justify-center gap-2 rounded-[4px] bg-[#357BC6] px-7 text-[18px] font-semibold text-white shadow-[0px_4px_12px_rgba(53,123,198,0.25)] transition-opacity hover:opacity-90 md:mt-10 md:h-[48px]"
        >
          <Home className="h-[18px] w-[18px]" strokeWidth={2.4} />
          Home
        </Link>
      </div>
    </section>
  );
}
