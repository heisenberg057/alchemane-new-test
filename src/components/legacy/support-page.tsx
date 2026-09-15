'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'How do I submit a support ticket for non-surgical hair replacement solutions at American Hairline?',
    a: 'To submit a support ticket, click the space indicated on our website to access our Google Form. Fill out the form with your inquiry details, and submit it to our support team.',
  },
  {
    q: 'Will I receive any confirmation after submitting a support ticket?',
    a: 'Yes. After submitting your support ticket, you will receive a confirmation email containing your unique ticket number. Please retain this for future reference.',
  },
  {
    q: 'What is the typical response time for a support ticket at American Hairline?',
    a: 'We typically respond to all support tickets within 24–48 hours. For urgent matters, please call our support line directly.',
  },
  {
    q: 'Is there a phone number I can call for immediate assistance?',
    a: 'Yes. You can reach our support team directly at 9222666111. Our team is available Monday to Saturday, 11 am to 8 pm.',
  },
  {
    q: 'Are there any guidelines I should follow when submitting a support ticket?',
    a: 'Please provide as much detail as possible — including your hair system type, the nature of the issue, and when it occurred. Uploading clear photos and a short video helps our team resolve your issue much faster.',
  },
];

const stores = {
  MUMBAI: {
    name: 'American Hairline - Mumbai',
    address: 'Saffron Building, 202, Linking Rd, opposite Satgurus Store, next to Global Devo, Khar West,\nMumbai, Maharashtra 400052',
    hours: [
      { day: 'Monday', time: 'Closed', closed: true },
      { day: 'Tuesday', time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday', time: '11 am to 8 pm', closed: false },
      { day: 'Friday', time: '11 am to 8 pm', closed: false },
      { day: 'Saturday', time: '11 am to 8 pm', closed: false },
      { day: 'Sunday', time: '11 am to 8 pm', closed: false },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.8347!3d19.0728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zAmerican+Hairline!5e0!3m2!1sen!2sin!4v1234567890',
  },
  BANGALORE: {
    name: 'American Hairline - Bangalore',
    address: '1st Floor, 80 Feet Road, Koramangala 4th Block,\nBangalore, Karnataka 560034',
    hours: [
      { day: 'Monday', time: 'Closed', closed: true },
      { day: 'Tuesday', time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday', time: '11 am to 8 pm', closed: false },
      { day: 'Friday', time: '11 am to 8 pm', closed: false },
      { day: 'Saturday', time: '11 am to 8 pm', closed: false },
      { day: 'Sunday', time: '11 am to 8 pm', closed: false },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.6245!3d12.9352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zAmerican+Hairline+Bangalore!5e0!3m2!1sen!2sin!4v1234567891',
  },
  DELHI: {
    name: 'American Hairline - Delhi',
    address: 'C-11, Second Floor, Green Park Extension,\nNew Delhi, Delhi 110016',
    hours: [
      { day: 'Monday', time: 'Closed', closed: true },
      { day: 'Tuesday', time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday', time: '11 am to 8 pm', closed: false },
      { day: 'Friday', time: '11 am to 8 pm', closed: false },
      { day: 'Saturday', time: '11 am to 8 pm', closed: false },
      { day: 'Sunday', time: '11 am to 8 pm', closed: false },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.0!2d77.2040!3d28.5600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zAmerican+Hairline+Delhi!5e0!3m2!1sen!2sin!4v1234567892',
  },
};

type City = 'MUMBAI' | 'BANGALORE' | 'DELHI';
const SUPPORT_FORM_URL = 'https://tinyurl.com/support-AHL';

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCity, setActiveCity] = useState<City>('MUMBAI');
  const store = stores[activeCity];

  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-[56px] md:py-[80px] px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)' }}
      >
        <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.5px] mb-[14px]">
          Customer Support
        </h1>
        <p className="text-white/70 text-[14px] md:text-[15px] font-medium">
          Home / <span className="text-white font-semibold">Customer Support</span>
        </p>
      </section>

      {/* ── WELCOME + HOW TO SUBMIT ── */}
      <section className="bg-white py-[64px] md:py-[80px] flex justify-center">
        <div className="w-full max-w-[860px] px-4 md:px-10 xl:px-0">

          <div className="text-center mb-[40px]">
            <h2 className="text-[22px] md:text-[32px] font-extrabold text-[#121212] tracking-[-0.3px] mb-[12px]">
              Welcome to American Hairline Support
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#555555] leading-[1.7] max-w-[500px] mx-auto">
              Need assistance with your non-surgical hair replacement solutions? Our support team is ready to help with any inquiries you might have.
            </p>
          </div>

          {/* How to submit card */}
          <div className="rounded-[14px] border border-[rgba(18,18,18,0.1)] p-[28px] md:p-[36px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.05)]">
            <h3 className="text-[16px] md:text-[17px] font-bold text-[#121212] mb-[20px]">
              How to Submit a Support Ticket
            </h3>
            <div className="flex flex-col gap-[14px]">
              {[
                { n: 1, bold: 'Fill Out the Form:', text: ' Click the space below to submit your ticket through our Google Form.' },
                { n: 2, bold: 'Ticket Confirmation:', text: ' Receive a confirmation email with your ticket number.' },
                { n: 3, bold: 'Response Time:', text: ' We typically respond within 24–48 hours.' },
              ].map((step) => (
                <div key={step.n} className="flex gap-[14px] items-start">
                  <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
                    style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)' }}>
                    {step.n}
                  </div>
                  <p className="text-[14px] md:text-[15px] text-[#444444] leading-[1.7] m-0">
                    <strong className="text-[#121212] font-semibold">{step.bold}</strong>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SUPPORT FORM ── */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[80px] flex justify-center">
        <div className="w-full max-w-[680px] px-4 md:px-10 xl:px-0">

          <h2 className="text-[20px] md:text-[26px] font-extrabold text-[#121212] tracking-[-0.3px] text-center mb-[40px]">
            Support | American Hairline
          </h2>

          <div className="rounded-[16px] border border-[rgba(18,18,18,0.08)] bg-white p-[28px] md:p-[36px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.06)]">
            <h3 className="text-[18px] md:text-[22px] font-extrabold text-[#121212] mb-[10px]">
              Submit Your Support Ticket
            </h3>
            <p className="text-[14px] md:text-[15px] text-[#555555] leading-[1.7] mb-[20px]">
              Our support workflow is handled through the official support form. Use it to share your issue details, upload the required media, and help our team resolve your request faster.
            </p>
            <div className="flex flex-col gap-[12px] text-[14px] text-[#444444] mb-[24px]">
              <p className="m-0">
                1. Open the support form and enter your contact details.
              </p>
              <p className="m-0">
                2. Describe the issue clearly and include photos or video inside the form.
              </p>
              <p className="m-0">
                3. Our team will review your ticket and respond within 24 to 48 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <a
                href={SUPPORT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-[8px] rounded-[8px] px-[20px] py-[13px] text-[14px] font-bold text-white no-underline transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 4px 14px rgba(23,105,255,0.3)' }}
              >
                Open Support Form <ArrowUpRight size={15} />
              </a>
              <a
                href="tel:+919222666111"
                className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(18,18,18,0.12)] px-[20px] py-[13px] text-[14px] font-bold text-[#121212] no-underline transition-colors hover:border-[#1769FF] hover:text-[#1769FF]"
              >
                Call 9222666111
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-[64px] md:py-[80px] flex justify-center">
        <div className="w-full max-w-[760px] px-4 md:px-10 xl:px-0">

          <h2 className="text-[26px] md:text-[36px] font-extrabold text-[#121212] tracking-[-0.5px] text-center mb-[40px]">
            Frequently Asked Questions
          </h2>

          {/* Accordion */}
          <div className="flex flex-col mb-[32px]">
            {faqs.map((faq, i) => (
              <div key={i} className="cursor-pointer rounded-[10px] border border-[rgba(18,18,18,0.08)] mb-[8px] overflow-hidden bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex justify-between items-center px-[20px] py-[16px]">
                  <span className={`text-[14px] md:text-[15px] leading-[1.4] pr-4 transition-all duration-300 ${openFaq === i ? 'font-semibold text-[#121212]' : 'font-normal text-[rgba(18,18,18,0.7)]'}`}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-[rgba(18,18,18,0.4)] flex-shrink-0" />
                    : <ChevronDown size={16} className="text-[rgba(18,18,18,0.4)] flex-shrink-0" />
                  }
                </div>
                {openFaq === i && (
                  <div className="px-[20px] pb-[16px]">
                    <p className="text-[14px] text-[#555555] leading-[1.7] m-0">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Blue CTA card */}
          <div className="rounded-[16px] p-[28px] md:p-[36px]"
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}>
            <h3 className="text-white text-[20px] md:text-[22px] font-extrabold tracking-[-0.3px] mb-[6px]">
              Still have questions?
            </h3>
            <p className="text-white/75 text-[14px] leading-[1.6] mb-[20px] m-0">
              No worries, we're here to guide you. Talk to us, we will explain everything.
            </p>
            <button
              className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[18px] py-[10px] rounded-[8px] text-[13px] font-bold transition-transform hover:scale-[1.02] duration-200"
              style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
            >
              Need Guidance <ArrowUpRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* ── STORE LOCATOR ── */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[80px] flex justify-center">
        <div className="w-full max-w-[1100px] px-4 md:px-10 xl:px-0">

          {/* City tabs */}
          <div className="flex justify-center gap-0 mb-[40px]">
            {(['MUMBAI', 'BANGALORE', 'DELHI'] as City[]).map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className="px-[24px] py-[10px] text-[13px] font-bold tracking-[0.08em] transition-all duration-200"
                style={{
                  color: activeCity === city ? '#1769FF' : 'rgba(18,18,18,0.45)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeCity === city ? '2px solid #1769FF' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Store info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] items-start">

            {/* Left: name + address + hours */}
            <div>
              <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#121212] mb-[10px]">
                {store.name}
              </h3>
              <div className="flex gap-[8px] items-start mb-[24px]">
                <MapPin size={15} className="text-[#1769FF] flex-shrink-0 mt-[3px]" />
                <p className="text-[14px] text-[#555555] leading-[1.6] m-0 whitespace-pre-line">
                  {store.address}
                </p>
              </div>

              <div className="flex items-center gap-[6px] mb-[14px]">
                <Clock size={14} className="text-[#1769FF]" />
                <span className="text-[13px] font-bold text-[#121212] uppercase tracking-[0.06em]">Opening Hours</span>
              </div>

              <div className="flex flex-col gap-[6px]">
                {store.hours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center">
                    <span className="text-[13px] text-[rgba(18,18,18,0.65)] w-[100px]">{h.day}</span>
                    <span className={`text-[13px] font-medium ${h.closed ? 'text-red-500' : 'text-[#121212]'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: store photo + map */}
            <div className="flex flex-col gap-[16px]">
              {/* Store photo */}
              <div className="relative w-full h-[180px] rounded-[12px] overflow-hidden bg-[#e8e8e8] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
                <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt={store.name} fill className="object-cover object-top" />
                <div className="absolute bottom-[10px] left-[10px] bg-white/90 backdrop-blur-sm rounded-[6px] px-[10px] py-[5px]">
                  <p className="text-[11px] font-bold text-[#121212] m-0">{store.name}</p>
                  <p className="text-[10px] text-[#555555] m-0">★★★★★ 5.0</p>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="w-full h-[200px] rounded-[12px] overflow-hidden shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] bg-[#e0e8f0]">
                <iframe
                  src={store.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${store.name} Map`}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
