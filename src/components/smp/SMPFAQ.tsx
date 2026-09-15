'use client';
import React, { useState } from 'react';
import { Plus, X, ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const faqs = [
  {
    question: "Is scalp micropigmentation painful?",
    answer: "Well, its not at all painful as we just deposit ink in the outer layer, that too after numbing the area. We can share hundreds of videos wherein they sharing their experiences with absolutely no pain."
  },
  {
    question: "Can SMP be done in one session?",
    answer: "Typically, SMP requires 2-3 sessions to achieve the perfect density and natural look. The first session lays the foundation, and subsequent sessions add depth and detail."
  },
  {
    question: "Does it fade?",
    answer: "SMP is semi-permanent and will fade over time (usually 3-5 years) but won't discolor like a traditional tattoo. Periodic touch-ups maintain the fresh look."
  },
  {
    question: "Will my hair continue to grow?",
    answer: "Yes, SMP does not affect your natural hair growth. You can continue to grow your existing hair, but most clients keep it shaved for the best blend."
  },
  {
    question: "Time between each SMP session?",
    answer: "We recommend a gap of 7-10 days between sessions to allow the scalp to heal and the pigment to settle properly."
  },
  {
    question: "Do I need a touch up?",
    answer: "Yes, touch-ups are recommended every few years to maintain the sharpness and density of the pigmentation as it naturally fades."
  },
  {
    question: "Which machine you use for SMP?",
    answer: "We use the Cheyenne Hawk, a premium German-made machine specifically designed for precision micropigmentation work."
  },
  {
    question: "Are there any side effects of Scalp tattooing?",
    answer: "When performed by certified professionals, side effects are minimal. You might experience slight redness for a day or two, but no long-term adverse effects."
  },
  {
    question: "Scalp micro-pigmentation cost in India?",
    answer: "Costs vary depending on the area to be covered (hairline, crown, full head). We offer competitive pricing with flexible payment plans."
  },
  {
    question: "Which ink you use for scalp micro pigmentation?",
    answer: "We use high-quality, carbon-based organic pigments from the USA that are specifically formulated for SMP and do not change color over time."
  }
];

export const SMPFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white py-16 px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-center mb-12 leading-[1.2] tracking-[-0.5px]">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl p-6 transition-all duration-300 ${openIndex === index ? 'bg-white shadow-sm border-gray-200' : 'bg-white border-transparent hover:bg-gray-50'}`}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-bold text-lg text-[#111111]">{faq.question}</span>
                {openIndex === index ? (
                  <X className="w-5 h-5 text-gray-400" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Card */}
        <div className="bg-[#0057FF] rounded-2xl p-8 text-white relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-2">Can't find your answer?</h3>
            <p className="text-blue-100 mb-6 max-w-[500px]">
                No worries, we're here to guide you. Talk to us, we will explain everything.
            </p>
            <button
                type="button"
                onClick={scrollToContactForm}
                className="bg-white text-[#1769FF] px-6 py-3 rounded-[10px] font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
                Contact Us
                <span className="w-6 h-6 rounded-[6px] bg-[#1769FF] flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </span>
            </button>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
