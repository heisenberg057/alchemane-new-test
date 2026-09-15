'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideRight { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
  .anim-fade-up  { animation: fadeUp    0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-scale-in { animation: scaleIn   0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-r  { animation: slideRight 0.60s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-l  { animation: slideLeft  0.60s cubic-bezier(0.4,0,0.2,1) both; }
  .delay-100 { animation-delay: 0.10s; }
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }
  .delay-400 { animation-delay: 0.40s; }
`;

const cardBodyStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 400,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
  margin: 0,
};

const cardBoldStyle: React.CSSProperties = {
  fontFamily: "'Proxima Nova', 'ProximaNova-Medium', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
};

const humanHairBullets = [
  { bold: 'National Reach:', text: " To meet India's growing demand, American Hairline provides premium human hair wigs across major cities like Mumbai and beyond." },
  { bold: 'High Quality:', text: ' We use 100% real, hand-tied human hair on breathable caps for a natural, comfortable fit.' },
  { bold: 'Styling Freedom:', text: ' Our human hair wigs can be styled, dyed, and heat-treated just like your natural hair.' },
  { bold: 'Medical Support:', text: ' Our wigs assist men facing alopecia or cancer treatments, restoring hair and self-confidence.' },
  { bold: 'Full Customization:', text: ' We provide expert consultations to tailor hair density and cap types to your specific lifestyle.' },
];

const fullWigsBullets = [
  { bold: 'Full Hair Wigs in Mumbai:', text: ' Full hair wigs are designed for men who desire a complete and transformative look. Ideal for those dealing with significant hair loss from conditions like alopecia or undergoing chemotherapy, our full hair wigs offer complete coverage and a natural appearance.' },
  { bold: 'Wigs For Cancer Patients:', text: ' Men who are undergoing chemotherapy, go through hair fall and lose most of their hair. Full wigs for men are ideal in such cases. We advise planning this well in advance.' },
  { bold: 'Wigs For Alopecia Patients:', text: ' Full wigs are designed for those who have lost most or all of their hair. This is a common solution for rising alopecia cases.' },
];

const methodsBullets = [
  { 
    bold: 'Stick On Wigs:', 
    sub: [
      'You need to shave off your natural hair and stick it to your scalp.',
      'Needs to be removed and stuck again every 20 to 25 days.'
    ]
  },
  { 
    bold: 'Elastic Cap Hair Wigs:', 
    sub: [
      'This wig cap has an elastic band at the back.',
      'It is to be worn like a cap.',
      'You do not need to shave off your hair for the same.',
      'You can wear it every morning and remove it every night.',
      'You can wear it as per your convenience.'
    ]
  },
];

const lifeBullets = [
  { bold: 'Stick On:', text: ' Stick-on systems typically last 5 to 9 months, depending on hair volume and the chosen base. While higher density increases durability, a lighter volume often provides a more natural appearance.' },
  { bold: 'Elastic Cap Hair Wigs:', text: " Elastic caps often last 12+ months since they aren't worn during sleep or showers. While they lack the stuck-down natural hairline of adhesive models, they are an ideal, low-maintenance starting point for new users. We recommend keeping your natural side burns if possible. If not, we can attach adhesive side burns to the wig or cut the elastic cap to create a natural-looking illusion of hair." }
];

const suggestionsAccordion = [
  { title: 'Start with a Consultation', desc: 'Before selecting a wig, speak with our specialists in Mumbai. We assess your hair loss pattern, scalp condition, and lifestyle to recommend the perfect solution.' },
  { title: 'Understand Your Cap Size', desc: 'An ill-fitting cap causes discomfort and looks unnatural. Our team takes precise measurements to ensure your system fits securely and comfortably.' },
  { title: 'Choose the Right Cap Type', desc: 'Lace fronts, monofilament tops, and skin base caps all offer different benefits. Our consultants will walk you through which option best suits your needs and budget.' },
  { title: 'Maintain Hair Quality', desc: "Mumbai's humidity can affect hair systems. Using our recommended sulphate-free care products keeps the hair soft, natural-looking, and long-lasting." },
  { title: 'Try Before You Buy', desc: 'We encourage all clients to sample styles during their consultation session so you leave feeling completely confident in your choice.' },
];

const faqs = [
  { q: 'Can I use a wig if I have a sensitive scalp?', a: 'Yes. We offer hypoallergenic base materials and use only dermatologically tested, skin-safe adhesives. Our team will recommend the best system for sensitive skin types.' },
  { q: "Are your wigs suitable for Mumbai's humidity?", a: 'Absolutely. Our systems are specifically selected for their breathability and humidity resistance. We also recommend adhesive types that maintain a strong bond in warm and humid conditions.' },
  { q: 'How can I find a wig salon near me in Mumbai?', a: 'We have service centres across Mumbai. Contact us to find the nearest location or book an online consultation and have your custom system delivered directly to your door.' },
  { q: 'Is it possible to get a natural hairline with a wig in Mumbai?', a: 'Yes. Our custom-designed hairlines are crafted to match your natural growth pattern. Every system includes a personalised hairline that looks completely realistic from any angle.' },
  { q: 'How often should I visit for maintenance in Mumbai?', a: 'We recommend a professional maintenance visit every 3–4 weeks for re-adhesion, cleaning, and styling. Between visits, our care kit and guides help you maintain your wig at home.' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function BulletGroup({ bullets }: { bullets: { bold: string; text?: string; sub?: string[] }[] }) {
  return (
    <div className="rounded-[16px] overflow-hidden h-full flex flex-col justify-center bg-white shadow-[0px_4px_24px_rgba(18,18,18,0.08)]">
      <div className="p-[24px] md:p-[32px] flex flex-col gap-[20px]">
        {bullets.map((b, i) => (
          <div key={i} className="flex flex-col">
            <p style={cardBodyStyle}>
              <strong style={cardBoldStyle}>• {b.bold}</strong>{b.text ? `${b.text}` : ''}
            </p>
            {b.sub && b.sub.length > 0 && (
              <div className="mt-[10px] flex flex-col gap-[8px] pl-[18px]">
                {b.sub.map((s, j) => (
                  <p key={j} style={{ ...cardBodyStyle, fontSize: '16px', color: '#555555' }}>
                    - {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <style>{globalStyles}</style>
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div ref={ref} className="text-center mb-[48px] md:mb-[64px]">
          <h1 className={`text-[32px] md:text-[52px] text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`} style={{ fontWeight: 800 }}>
            Hair Wigs For Men<br />In Mumbai
          </h1>
          <p className={`text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`} style={{ fontSize: '16px', fontWeight: 500 }}>
            Struggling with hair loss or thinning hair? Our high-quality hair wigs for men in Mumbai offer a natural-looking, comfortable solution. Discover how our premium hair wigs can help you regain confidence and achieve the hairstyle you've always dreamed of.
          </p>
        </div>
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Wigs In Mumbai" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white leading-none m-0 uppercase tracking-[0.08em]" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}>HAIR WIGS</p>
            <p className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]" style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}>IN MUMBAI</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HumanHairSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Men's Human Hair Wigs<br />In Mumbai
        </h2>
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">
          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Men's Human Hair Wigs" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.4)] via-[rgba(5,7,10,0.1)] to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200" style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={humanHairBullets} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FullWigsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Full Hair Wigs Are Meant For:
        </h2>
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={fullWigsBullets} />
          </div>
          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Full Hair Wigs Mumbai" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200" style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Methods Of Application
        </h2>
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">
          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Application" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200" style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={methodsBullets} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SuggestionsSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: contentRef, inView: contentInView } = useInView(0.1);
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Our Suggestions For Choosing The<br />Right Wig In Mumbai
        </h2>
        <div ref={videoRef} className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[380px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] mb-[40px] md:mb-[48px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Why He Cried After Hair Restoration" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,7,10,0.5) 0%, rgba(5,7,10,0.75) 100%)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px] text-center gap-[8px]">
            <p className="text-white leading-[1.1] tracking-[-0.5px] uppercase m-0" style={{ fontSize: 'clamp(22px, 3.5vw, 40px)', fontWeight: 800 }}>WHY HE CRIED?</p>
            <p className="text-white/80 leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 2.2vw, 26px)', fontWeight: 800 }}>AFTER HAIR RESTORATION</p>
            <p className="m-0 mt-[4px]" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>😮</p>
          </div>
          <div className="absolute inset-0 flex items-end justify-center pb-[24px] md:pb-[32px]">
            <button className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200" style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
              <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
            </button>
          </div>
        </div>
        <div ref={contentRef} className={`max-w-[760px] mx-auto ${contentInView ? 'anim-fade-up' : 'opacity-0'}`}>
          <p style={{ ...cardBodyStyle, color: '#555555', marginBottom: '32px' }}>
            Selecting the right wig requires careful consideration. Our specialists are here to guide you through every step — from base material to hair type to attachment method. Here are our top suggestions to help you make the best choice for your lifestyle and preferences.
          </p>
          <div className="flex flex-col gap-[8px]">
            {suggestionsAccordion.map((item, i) => (
              <div key={i} className="bg-white rounded-[12px] overflow-hidden cursor-pointer" style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                <div className="flex justify-between items-center px-[20px] md:px-[24px] py-[16px] md:py-[18px]">
                  <span style={{ ...cardBodyStyle, fontWeight: openIndex === i ? 700 : 400, color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.75)', paddingRight: '16px', transition: 'all 0.3s' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none' as const, lineHeight: 1 }}>{openIndex === i ? '×' : '+'}</span>
                </div>
                {openIndex === i && (
                  <div className="px-[20px] md:px-[24px] pb-[18px]">
                    <p style={{ ...cardBodyStyle, color: '#555555' }}>{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LifeSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Life Of The Hair Wig
        </h2>
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={lifeBullets} />
          </div>
          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Life of Hair Wig Mumbai" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200" style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}>
          Frequently Asked Questions
        </h2>
        <div ref={ref} className="max-w-[760px] mx-auto">
          <div className={`flex flex-col mb-[40px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            {faqs.map((faq, i) => (
              <div key={i} className="cursor-pointer" style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                  <span style={{ ...cardBodyStyle, fontWeight: 700, paddingRight: '16px', transition: 'color 0.3s', color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)' }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none' as const, lineHeight: 1 }}>{openIndex === i ? '×' : '+'}</span>
                </div>
                {openIndex === i && <p style={{ ...cardBodyStyle, paddingBottom: '20px' }}>{faq.a}</p>}
              </div>
            ))}
          </div>
          <div className={`rounded-[16px] p-[28px] md:p-[36px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>Still have questions?</h3>
            <p style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', lineHeight: '150%', letterSpacing: '-0.16px', marginBottom: '24px', maxWidth: '400px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <button className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200" style={{ fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}>
              Send Queries <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MumbaiPage() {
  return (
    <main>
      <HeroSection />
      <HumanHairSection />
      <FullWigsSection />
      <MethodsSection />
      <SuggestionsSection />
      <LifeSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}
