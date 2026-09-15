'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Plus, X } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   ALL 35 FAQ ITEMS — exact from reference
───────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'What should I do, I don\'t want surgery but my hair is thinning?',
    a: 'The number of non-surgical options available today are fantastic. We will go over many of them before making a recommendation to you based on your individual needs, your degree of hair loss, activities you\'re involved in and more. These factors will play a key part in finding the best solution for you and make you feel comfortable.',
  },
  {
    q: 'What is the difference between surgical and non-surgical hair restoration?',
    a: 'Surgical hair restoration involves transplanting hair follicles from a donor area to areas of hair loss, requiring a medical procedure with recovery time. Non-surgical options include hair systems, wigs, and patches that are attached externally — no surgery, no recovery, and immediate results.',
  },
  {
    q: 'Can I still take part in sports?',
    a: 'Absolutely. Our hair systems are designed for active lifestyles. With the right attachment method and adhesive, you can swim, run, exercise, and participate in any sport without worrying about your system.',
  },
  {
    q: 'My father had a hairpiece that he would take off at night. I can remember my Grand-mother wearing a heavy wigs that never moved. Is this the same thing?',
    a: 'Not at all. Today\'s hair systems are dramatically different from older hairpieces. Modern systems use ultra-thin, breathable bases with 100% human hair, and the latest adhesive technology means they stay securely in place day and night for weeks at a time.',
  },
  {
    q: 'Will I have limitation on what hairstyle I want or how I comb my hair?',
    a: 'No. Our hair systems use 100% human hair and can be styled, cut, combed, and even coloured just like natural hair. You will have complete freedom to style your hair any way you wish.',
  },
  {
    q: 'What is the average life span of hair replacement system? And how often do I need to replace it?',
    a: 'The average lifespan of a quality hair system is 6–12 months depending on the base material, maintenance routine, and lifestyle. With proper care and regular servicing, premium systems can last even longer.',
  },
  {
    q: 'How long do you expect the hair system to remain on my head?',
    a: 'With a secure adhesive bond, a hair system typically remains on the head for 2–4 weeks before a maintenance visit is needed to re-adhesive and refresh. Some systems can hold longer depending on adhesive type and lifestyle.',
  },
  {
    q: 'Will I be able to swim, shower, sleep or exercise with my hair system on?',
    a: 'Yes. Our hair systems are designed for all-day, everyday wear. You can swim, shower, sleep, and exercise with your system on. We recommend using waterproof adhesive for active lifestyles and following our post-swim care routine.',
  },
  {
    q: 'How long will it take to get my hair replacement system?',
    a: 'A fully customised hair system typically takes 3–4 weeks from consultation to delivery. Stock systems can often be available much sooner. During your consultation, we will give you an exact timeline.',
  },
  {
    q: 'Is it difficult to maintain a hair replacement system? and can I style it?',
    a: 'Maintenance is straightforward once you learn the routine. We provide a full care kit, detailed instructions, and video guides. You can style your system exactly like natural hair — cut, blow-dry, curl, or straighten it.',
  },
  {
    q: 'What is the best way to clean a hair system?',
    a: 'Use a sulphate-free, gentle shampoo and a moisturising conditioner. Wash every 7–14 days depending on your activity level. Avoid harsh chemicals and always let the system air dry before re-adhesiving for best results.',
  },
  {
    q: 'I have sensitive skin, will your hair systems irritate my scalp?',
    a: 'We use medical-grade, dermatologically tested adhesives and hypoallergenic base materials. Most clients with sensitive skin experience no irritation. During consultation, we will assess your scalp and recommend the most suitable system and adhesive for you.',
  },
  {
    q: 'Are your hair systems itchy to the scalp?',
    a: 'No. Modern hair systems with breathable bases feel very comfortable. Any minor initial sensation typically resolves within the first few days as you adjust to wearing the system.',
  },
  {
    q: 'Will a hair system harm my scalp and increase my hair loss?',
    a: 'No. Properly applied and maintained hair systems do not harm your scalp or accelerate hair loss. We use skin-safe products and follow careful application procedures to ensure your scalp health is protected.',
  },
  {
    q: 'Do you offer customisations to your systems, such as highlights, colors and densities?',
    a: 'Yes. Every aspect of your system can be fully customised — including hair colour, highlights, density, wave pattern, base material, hairline shape, and size. We create a system that is uniquely yours.',
  },
  {
    q: 'Which is better for attaching hair systems? Tape or Adhesives?',
    a: 'Both have their advantages. Tape provides a clean, even bond and is easy to remove. Liquid adhesive typically provides a longer-lasting, more flexible hold. Many clients use a combination. During consultation, we will help you choose the best method for your lifestyle.',
  },
  {
    q: 'Is it necessary to shave my head in order to wear a system?',
    a: 'Not always. For many clients, a clean shave provides the most secure and natural-looking result. However, depending on the extent of your hair loss and the type of system, shaving may not be required. We assess this during consultation.',
  },
  {
    q: 'Will your hair replacements look like my own hair?',
    a: 'Yes. Our systems are crafted with 100% human hair matched to your exact colour, texture, and density. The result is completely natural-looking and undetectable, even up close.',
  },
  {
    q: 'Is there such a thing as an undetectable hair system?',
    a: 'Yes. With today\'s advanced base materials — including ultra-thin skin bases and lace fronts — and expert colour matching, modern hair systems are virtually undetectable even in close, direct contact.',
  },
  {
    q: 'What about comfort?',
    a: 'Comfort is a top priority. Our breathable, lightweight bases are designed for all-day wear. Most clients forget they are wearing a hair system within a few days of putting it on for the first time.',
  },
  {
    q: 'What about other people finding out?',
    a: 'Our systems are designed to be completely undetectable. Thousands of our clients — including professionals, athletes, and public figures — wear our systems daily without anyone knowing. The result is 100% natural.',
  },
  {
    q: 'What is the leading cause of hair loss?',
    a: 'The most common cause of hair loss in men is hereditary androgenetic alopecia (male pattern baldness), accounting for over 95% of cases. Other causes include stress, nutritional deficiencies, hormonal changes, and scalp conditions.',
  },
  {
    q: 'What is the second most common reason for hair loss?',
    a: 'Telogen effluvium — a temporary condition triggered by stress, illness, surgery, or significant life changes — is the second most common cause of hair loss. It often resolves once the underlying trigger is addressed.',
  },
  {
    q: 'Where is the hair from?',
    a: 'We use 100% ethically sourced human hair. Our hair is carefully selected for quality, ensuring consistent texture, colour, and movement that matches and blends naturally with your existing hair.',
  },
  {
    q: 'Will custom hair system damage my own hair?',
    a: 'No. When applied correctly using recommended products and methods, our hair systems do not damage your existing hair. Our trained specialists take care to protect your natural hair during every service.',
  },
  {
    q: 'Can I dye my hair with my custom hair replacement system?',
    a: 'Yes. Our 100% human hair systems can be coloured and highlighted. We recommend having this done by a professional who is experienced with hair systems to achieve the best result and avoid any risk to the base.',
  },
  {
    q: 'Can I do my own attachments?',
    a: 'Yes, with the right training and products. We provide self-attachment kits, detailed instructions, and video tutorials so you can maintain and re-adhesive your system confidently at home between professional visits.',
  },
  {
    q: 'Can I go swimming using a hair system or will this damage the hair?',
    a: 'Yes, you can swim. We recommend using a waterproof adhesive and rinsing your system thoroughly with fresh water after swimming. Following our post-swim care routine ensures the system remains secure and the hair stays in great condition.',
  },
  {
    q: 'When I wake in the morning I noticed that my hair is very messy and disheveled. Do you have any tips to minimize friction during my sleep?',
    a: 'Yes. We recommend sleeping on a silk or satin pillowcase to reduce friction. You can also loosely braid your hair or wear a light sleep cap. A small amount of leave-in conditioner before bed also helps keep the hair manageable overnight.',
  },
  {
    q: 'I\'m afraid my hair system will fall off does that still happen?',
    a: 'No. With modern medical-grade adhesives, a properly applied hair system will not fall off unexpectedly. Our systems are tested for security in a wide range of conditions including swimming, exercise, and sleep.',
  },
  {
    q: 'Can I have the kind of hair system that is removed at night, or does it have to be attached for a month or more at a time?',
    a: 'Yes. We offer both clip-on systems that can be removed nightly and bonded systems designed for extended wear. During your consultation, we will recommend the best attachment method based on your lifestyle and preferences.',
  },
  {
    q: 'Are attachment methods expensive? Is this an extra charge?',
    a: 'Attachment products — including tape, adhesive, and remover — are included in our maintenance packages. Individual products are also available to purchase separately. We are transparent about all costs during your consultation.',
  },
  {
    q: 'I live far away from your salon locations. You say that I can go anywhere to have my monthly hair loses. When I am wearing a system is their anything special that the stylist trimming my system must know?',
    a: 'Yes. It\'s important to let your stylist know that you are wearing a hair system. We provide a stylist guide card that outlines the key points they need to know — including how to cut, blend, and style your system safely. We can also coach your local stylist by phone or video if needed.',
  },
  {
    q: 'Do you use human or synthetic hair?',
    a: 'We use 100% human hair in all our systems. Human hair provides the most natural look, feel, and styling versatility, and can be treated just like your own hair.',
  },
  {
    q: 'Do I really need two hair systems?',
    a: 'Having two systems is recommended but not required. A second system allows you to rotate between them, extending the life of each system and ensuring you are never without a fresh-looking hair system during servicing.',
  },
  {
    q: 'How is it possible for me to do my own attachments?',
    a: 'We provide a complete self-attachment kit, step-by-step instructions, and video tutorials. Most clients become confident in self-attachment within a few practice sessions. Our team is always available by phone or video to guide you through the process.',
  },
  {
    q: 'I see bad hairpieces on the streets. Are yours any better?',
    a: 'Absolutely. The difference is dramatic. Old-style hairpieces used thick bases, synthetic hair, and poor colour matching. Our modern systems use ultra-thin bases, 100% matched human hair, and expert styling to create a result that is completely natural and undetectable.',
  },
];

/* ─────────────────────────────────────────────────────────────
   Animated accordion item
───────────────────────────────────────────────────────────── */
function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      // measure then animate to full height
      setHeight(bodyRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      onClick={onToggle}
      className="cursor-pointer rounded-[12px] bg-white mb-[10px] select-none"
      style={{
        border: '1px solid #e8e8e8',
        boxShadow: isOpen
          ? '0 4px 20px rgba(0,0,0,0.07)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.35s ease',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-[16px] px-[22px] py-[18px]">
        <span className="text-[14px] md:text-[15px] leading-[1.45] flex-1 font-semibold text-[#121212]">
          {faq.q}
        </span>

        {/* + / × icon */}
        <div
          className="flex-shrink-0 mt-[2px] flex items-center justify-center w-[22px] h-[22px]"
          style={{
            color: '#aaaaaa',
            transition: 'color 0.25s ease, transform 0.35s ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <Plus size={18} strokeWidth={1.5} />
        </div>
      </div>

      {/* Animated body */}
      <div
        style={{
          height: `${height}px`,
          overflow: 'hidden',
          transition: 'height 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={bodyRef} className="px-[22px] pb-[20px]">
          <p className="m-0 text-[14px] text-[#555555] leading-[1.75]">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function CommonQuestionsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-[56px] md:py-[80px] px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)' }}
      >
        <h1 className="text-[32px] md:text-[48px] font-extrabold leading-[1.15] tracking-[-0.5px] mb-[14px] text-white">
          Common Questions
        </h1>
        <p className="text-white/70 text-[14px] md:text-[15px] font-medium">
          Home / <span className="text-white font-semibold">Common Questions</span>
        </p>
      </section>

      {/* ── FAQ CONTENT ── */}
      <section className="w-full flex justify-center py-[64px] md:py-[100px]">
        <div className="w-full max-w-[860px] px-4 md:px-10 xl:px-0">

          <h2 className="text-[24px] md:text-[34px] font-extrabold text-[#121212] tracking-[-0.5px] mb-[40px]">
            Frequently Asked Questions
          </h2>

          {/* Accordion — card-style, one open at a time */}
          <div className="flex flex-col mb-[48px]">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* Blue CTA card */}
          <div
            className="rounded-[16px] p-[28px] md:p-[36px]"
            style={{
              background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)',
              boxShadow: '0 12px 32px rgba(23,105,255,0.3)',
            }}
          >
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

    </main>
  );
}