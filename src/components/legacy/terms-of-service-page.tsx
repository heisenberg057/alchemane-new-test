'use client';

import React from 'react';

/* ─────────────────────────────────────────────────────────────
   TERMS OF SERVICE PAGE
   Blue gradient hero + numbered sections document.
   No navbar or footer — handled globally.
───────────────────────────────────────────────────────────── */

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[32px]">
      <h2 className="text-[15px] md:text-[16px] font-bold text-[#121212] mb-[8px] uppercase">
        {number}. {title}
      </h2>
      <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.8] m-0">
        {children}
      </p>
    </div>
  );
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-[56px] md:py-[80px] px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)' }}
      >
        <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.5px] mb-[14px]">
          Terms of Service
        </h1>
        <p className="text-white/70 text-[14px] md:text-[15px] font-medium">
          Home / <span className="text-white font-semibold">Terms of Service</span>
        </p>
      </section>

      {/* ── DOCUMENT CONTENT ── */}
      <section className="w-full flex justify-center py-[64px] md:py-[100px]">
        <div className="w-full max-w-[860px] px-4 md:px-10 xl:px-0">

          {/* Intro */}
          <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.8] mb-[40px]">
            Before using www.americanhairline.com, the user must accept the terms and conditions outlined below. By accessing the site on any device, including mobile and computer terminals, the user accepts these terms and agrees that American Hairline Private Limited can modify them at any time without prior notice. To ensure a better understanding of our customers, users are required to consent to adhering to the revised terms and are encouraged to regularly check the page for any updates.
          </p>

          <Section number="1" title="DESCRIPTION OF SERVICE">
            American Hairline Private Limited is a hair extensions and hair products brand that designs all products in-house and sells them exclusively online.
          </Section>

          <Section number="2" title="USAGE RESTRICTIONS">
            All content on the American Hairline website, including visuals, text, audio, and video clips, is protected by copyright or other intellectual property rights. To cater to our customers' needs, the content is intended solely for personal and non-commercial use. To ensure our customers' understanding, it is important to note that engaging in unauthorized use of the materials could potentially infringe upon copyright, trademark, and other applicable laws.
          </Section>

          <Section number="3" title="NOTICE">
            American Hairline Private Limited may contact or provide customers with service-related and promotional notices via different means such as postal mail, electronic mail, general site notifications, etc. In order to better understand our customers, we utilize the contact information provided by the user. By using the website, you consent to receive such communications from us.
          </Section>

          <Section number="4" title="PRICING POLICY">
            American Hairline Private Limited sells its products exclusively online, and its pricing policy aims to provide customers with quality products at reasonable prices. To ensure our customers' understanding, although we strive to accurately display the products, there may be variations in patterns and color. We reserve the right to modify prices and product offerings at any time without prior notice.
          </Section>

          <Section number="5" title="SITE USE">
            Customers may not access or use the American Hairline website for illegal or unauthorized purposes. They must ensure that no comments or user submissions to the American Hairline website violate any third party's rights, including copyright, trademark, privacy, or personal rights. The customer is solely responsible for the content of any comments made on the site.
          </Section>

          <Section number="6" title="INDEMNITY">
            Customers agree to indemnify and hold American Hairline Private Limited and its affiliates, directors, officers, employees, and agents harmless from any claims, losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these terms of service or any activity related to their account.
          </Section>

          <Section number="7" title="THIRD PARTY LINKS">
            The American Hairline website may contain links to third-party websites or services that are not owned or controlled by American Hairline Private Limited. To better serve our customers, it is important to note that we neither endorse nor take any responsibility for the content, privacy policies, or practices of such websites or services. You acknowledge and agree that American Hairline Private Limited shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </Section>

          <Section number="8" title="PRIVACY POLICY">
            American Hairline Private Limited is committed to protecting your privacy and personal information. Our privacy practices are described in our separate Privacy Policy, which is incorporated by reference into these terms of service. By using the website, you consent to our collection, use, and disclosure of your personal information as described in the Privacy Policy.
          </Section>

          <Section number="9" title="SECURITY">
            To ensure our customers' understanding, we prioritize the security of your information. we implement security measures that align with industry standards, safeguarding your personal information against unauthorized access, alteration, disclosure, or destruction. In order to better inform our customers, it is important to acknowledge that no method of transmission over the internet or electronic storage can guarantee 100% security. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </Section>

          <Section number="10" title="CHANGES TO TERMS OF SERVICE">
            American Hairline Private Limited reserves the right to modify or replace these terms of service at any time. To cater to our customers' needs, we provide the most up-to-date version.
          </Section>

        </div>
      </section>

    </main>
  );
}