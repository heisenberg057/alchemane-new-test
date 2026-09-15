'use client';

/* ─────────────────────────────────────────────────────────────
   DISCLAIMER POLICY PAGE
   Blue gradient hero banner + white document content area.
   No navbar or footer — handled globally.
───────────────────────────────────────────────────────────── */
export default function DisclaimerPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-[56px] md:py-[80px] px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)',
        }}
      >
        <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.5px] mb-[14px]">
          Disclaimer Policy
        </h1>
        <p className="text-white/70 text-[14px] md:text-[15px] font-medium">
          Home / <span className="text-white font-semibold">Disclaimer Policy</span>
        </p>
      </section>

      {/* ── DOCUMENT CONTENT ── */}
      <section className="w-full flex justify-center py-[64px] md:py-[100px]">
        <div className="w-full max-w-[860px] px-4 md:px-10 xl:px-0">

          {/* Company / Brand header */}
          <div className="mb-[32px] flex flex-col gap-[6px]">
            <p className="text-[15px] md:text-[16px] text-[#121212] m-0">
              <strong className="font-bold">Company Name</strong>- Aesthetique Solutions
            </p>
            <p className="text-[15px] md:text-[16px] text-[#121212] m-0">
              <strong className="font-bold">Brand Name</strong>- American Hairline
            </p>
          </div>

          {/* Intro paragraph */}
          <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.8] mb-[40px]">
            In our commitment to transparency and professionalism, American Hairline understands the importance of providing clear disclaimers to our valued customers. A disclaimer serves as a legal notice that outlines the terms and conditions of our services, ensuring that all parties involved have a clear understanding of their rights and responsibilities. With this in mind, we have meticulously crafted a comprehensive disclaimer that aligns with industry standards and addresses key aspects of our business operations.
          </p>

          {/* Section */}
          <Section title="Introduction">
            American Hairline is dedicated to providing exceptional non-surgical hair replacement systems tailored to meet the unique needs of each individual. Our handcrafted solutions are designed to replicate the natural look and feel of real hair, enhancing confidence and restoring a sense of normalcy for those experiencing hair loss.
          </Section>

          {/* Disclaimer Overview — heading only */}
          <h2 className="text-[16px] md:text-[17px] font-bold text-[#121212] mb-[32px]">
            Disclaimer Overview
          </h2>

          <Section title="Limitation of Liability">
            While we strive to deliver the highest quality products and services, it is important to acknowledge that results may vary depending on individual factors such as hair texture, scalp condition, and lifestyle habits. American Hairline cannot guarantee specific outcomes and shall not be held liable for any dissatisfaction or unforeseen consequences arising from the use of our products.
          </Section>

          <Section title="Product Representation">
            We make every effort to accurately represent our hair replacement systems through photographs, descriptions, and testimonials. However, it is essential to recognize that variations may occur due to differences in lighting, screen resolution, and personal interpretation. Customers are encouraged to consult with our team for personalized recommendations based on their unique preferences and needs.
          </Section>

          <Section title="Consultation and Consent">
            Prior to undergoing any hair replacement procedure, clients are required to undergo a thorough consultation with one of our qualified specialists. During this process, we will assess the client's hair loss pattern, discuss available options, and address any concerns or questions. By proceeding with our services, clients acknowledge their understanding of the potential risks and benefits and provide informed consent for treatment.
          </Section>

          <Section title="Maintenance and Care">
            Proper maintenance and care are essential for maximizing the longevity and appearance of our hair replacement systems. We provide detailed instructions and recommendations for cleaning, styling, and upkeep to ensure optimal results. However, American Hairline cannot be held responsible for damage caused by improper handling, neglect, or failure to follow our guidelines.
          </Section>

          <Section title="Privacy and Confidentiality">
            Respecting the privacy and confidentiality of our clients is of utmost importance to us. We adhere to strict confidentiality protocols to safeguard personal information and maintain discretion throughout the consultation and treatment process. Client records and sensitive data are protected in accordance with applicable privacy laws and regulations.
          </Section>

          <Section title="Conclusion" isLast>
            At American Hairline, we are committed to upholding the highest standards of professionalism, integrity, and customer satisfaction. Our disclaimer serves as a testament to our dedication to transparency and accountability in all aspects of our business operations. By providing clear and concise information, we aim to empower our clients to make informed decisions and embark on their journey to renewed confidence and self-assurance.
          </Section>

        </div>
      </section>

    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION COMPONENT — bold heading + paragraph
───────────────────────────────────────────────────────────── */
function Section({
  title,
  children,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className={isLast ? '' : 'mb-[32px]'}>
      <h2 className="text-[16px] md:text-[17px] font-bold text-[#121212] mb-[8px]">
        {title}
      </h2>
      <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.8] m-0">
        {children}
      </p>
    </div>
  );
}