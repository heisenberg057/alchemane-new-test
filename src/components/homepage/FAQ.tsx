'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const consultationFaqs = [
  { question: "How long does the consultation take?", answer: "Usually 30 to 45 minutes. We take time to understand you and answer all your questions properly." },
  { question: "What happens in the consultation?", answer: "We assess your hair loss condition, discuss your lifestyle needs, and recommend the best hair system options for you." },
  { question: "Is it an in-person or online consultation?", answer: "We offer both! You can visit our clinic for a physical assessment or book a video call for a virtual consultation." },
  { question: "Will I get to see real samples or demos?", answer: "Yes, during an in-person consultation, you can see and feel the hair systems. For online consultations, we show high-quality videos and close-ups." },
  { question: "Will I be pressured to buy during the consultation?", answer: "Absolutely not. Our goal is to educate you so you can make an informed decision when you are ready." },
  { question: "Will I know the total cost after the consultation?", answer: "Yes, we provide a transparent cost breakdown including the hair system, fitting, and maintenance." },
];

const hairSystemFaqs = [
  { question: "How long does a hair system last?", answer: "Depending on the base type and care, a hair system typically lasts between 3 to 6 months." },
  { question: "Can I swim and shower with it?", answer: "Yes! Our hair systems are securely bonded, allowing you to swim, shower, and exercise without worry." },
  { question: "Does it look natural?", answer: "Our systems are designed to be undetectable, with a natural hairline and density that matches your existing hair." },
  { question: "How often do I need maintenance?", answer: "We recommend a maintenance session every 3-4 weeks for cleaning and re-bonding." },
  { question: "Can I style it like my own hair?", answer: "Yes, you can cut, style, and use products just like you would with your natural hair." },
  { question: "Is it comfortable to wear?", answer: "Modern hair systems are lightweight and breathable, ensuring comfort even during extended wear." },
];

export const FAQ = () => {
  const [activeTab, setActiveTab] = useState<'Consultation' | 'Hair System'>('Consultation');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const activeFaqs = activeTab === 'Consultation' ? consultationFaqs : hairSystemFaqs;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#f5f6f7] flex flex-col items-center px-[20px]">
      <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-extrabold text-[#121212] text-center mb-[24px] leading-tight lg:leading-[53px] tracking-[-0.5px]">
         Frequently Asked Questions
      </h2>
      
      {/* Toggle */}
      <div className="flex bg-white rounded-[8px] p-[2px] border border-[#12121214] mb-[40px] w-full max-w-[358px] h-[44px]">
         <button 
            onClick={() => { setActiveTab('Consultation'); setOpenIndex(0); }}
            className={`flex-1 rounded-[6px] font-bold text-[18px] leading-[22px] transition-all ${
               activeTab === 'Consultation' 
               ? 'bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white shadow-[0px_36px_10px_0px_rgba(0,0,0,0),0px_23px_9px_0px_rgba(0,0,0,0.01),0px_13px_8px_0px_rgba(0,0,0,0.04),0px_6px_6px_0px_rgba(0,0,0,0.07),0px_1px_3px_0px_rgba(0,0,0,0.15)]' 
               : 'text-[#121212] hover:bg-gray-50'
            }`}
         >
            Consultation
         </button>
         <button 
            onClick={() => { setActiveTab('Hair System'); setOpenIndex(0); }}
            className={`flex-1 rounded-[6px] font-bold text-[18px] leading-[22px] transition-all ${
               activeTab === 'Hair System' 
               ? 'bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white shadow-md' 
               : 'text-[#121212] hover:bg-gray-50'
            }`}
         >
            Hair System
         </button>
      </div>

      <div 
        key={activeTab}
        className="w-full max-w-[608px] flex flex-col gap-[16px]"
        style={{
          animation: 'fadeInUp 300ms ease forwards',
        }}
      >
         {activeFaqs.map((faq, index) => (
            <div 
               key={index} 
               onClick={() => toggleFaq(index)}
               className={`bg-white rounded-[16px] border transition-all duration-300 overflow-hidden cursor-pointer ${
                  openIndex === index 
                  ? 'border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]' 
                  : 'border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]'
               }`}
            >
               <div className="flex items-start justify-between p-[19px_23px]">
                  <div className="flex flex-col">
                     <h3 className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">
                        {faq.question}
                     </h3>
                     <div 
                       style={{ 
                         maxHeight: openIndex === index ? '200px' : '0px', 
                         opacity: openIndex === index ? 1 : 0, 
                         overflow: 'hidden', 
                         transition: 'max-height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease', 
                       }} 
                     > 
                       <p className="text-[18px] text-[#555555] leading-[25px] tracking-[-0.16px] max-w-[487px] pb-[4px]">
                         {faq.answer}
                       </p>
                     </div>
                  </div>
                  {/* Plus/Cross Icon Logic */}
                  <div className="relative w-[24px] h-[24px] shrink-0 mt-1">
                     {/* Plus Icon */}
                     <svg 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className={`absolute inset-0 transition-all duration-300 ${openIndex === index ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                     >
                        <path d="M12 5V19M5 12H19" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                     {/* Cross Icon */}
                     <svg 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className={`absolute inset-0 transition-all duration-300 ${openIndex === index ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
                     >
                        <path d="M18 6L6 18M6 6L18 18" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                  </div>
               </div>
            </div>
         ))}

         {/* Call to Action Box */}
         <div className="bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[16px] p-[19px_23px] text-white flex flex-col items-start border border-[#12121214]">
            <h3 className="text-[32px] font-bold leading-[42px] tracking-[-0.5px] mb-[8px]">Still have questions?</h3>
            <p className="text-[18px] text-white leading-[24px] tracking-[-0.16px] mb-[24px] max-w-[560px]">
               No worries, we’re here to guide you. Talk to us, we will explain everything.
            </p>
            <a href="#contact-form" className="bg-white text-[#121212] px-[20px] py-[10px] rounded-[8px] font-semibold text-[18px] leading-[24px] tracking-[-0.1px] flex items-center gap-[8px] hover:bg-gray-100 transition-colors">
               <span>Need Guidance</span>
               <div className="bg-[#121212]/5 p-[1px] rounded-full">
                  <ArrowUpRight className="w-[20px] h-[20px]" />
               </div>
            </a>
         </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
