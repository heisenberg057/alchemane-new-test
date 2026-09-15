"use client";

import type { ReactNode } from "react";
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const mistakes = [
  {
    title: "Too much density:",
    body: "Cheap systems pack too much hair, making it look instantly fake and helmet-like.",
  },
  {
    title: "Poor base materials:",
    body: "Thick plastic bases cause intense sweating, itching, and discomfort in Indian weather.",
  },
  {
    title: "Zero customization:",
    body: "Stock templates don't match your facial structure, exposing the front hairline completely.",
  },
];

const approach = [
  {
    title: "Age-appropriate density:",
    body: "We calculate biological density based on your age and remaining hair for a natural blend.",
  },
  {
    title: "Premium breathable base:",
    body: "Swiss lace and ultra-thin skin hybrids allow your scalp to breathe.",
  },
  {
    title: "Precision design:",
    body: "Every unit is mapped to your skull curvature and features for an undetectable hairline.",
  },
];

function WrongIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <g clipPath="url(#results-mistakes-wrong-clip)">
        <rect width="20" height="20" rx="2" fill="#E21B1B" />
        <path d="M19.375 16.25C19.375 17.9688 17.9688 19.375 16.25 19.375H3.75C2.03125 19.375 0.625 17.9688 0.625 16.25V3.75C0.625 2.03125 2.03125 0.625 3.75 0.625H16.25C17.9688 0.625 19.375 2.03125 19.375 3.75V16.25Z" fill="#E21B1B" />
        <path d="M15.625 6.625L13.375 4.375L10 7.75L6.625 4.375L4.375 6.625L7.75 10L4.375 13.375L6.625 15.625L10 12.25L13.375 15.625L15.625 13.375L12.25 10L15.625 6.625Z" fill="white" />
      </g>
      <defs>
        <clipPath id="results-mistakes-wrong-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CorrectIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <g clipPath="url(#results-mistakes-correct-clip)">
        <path d="M8.44444 11.5556L6.05555 9.16667C5.85185 8.96296 5.59259 8.86111 5.27778 8.86111C4.96296 8.86111 4.7037 8.96296 4.5 9.16667C4.2963 9.37037 4.19444 9.62963 4.19444 9.94444C4.19444 10.2593 4.2963 10.5185 4.5 10.7222L7.66667 13.8889C7.88889 14.1111 8.14815 14.2222 8.44444 14.2222C8.74074 14.2222 9 14.1111 9.22222 13.8889L15.5 7.61111C15.7037 7.40741 15.8056 7.14815 15.8056 6.83333C15.8056 6.51852 15.7037 6.25926 15.5 6.05555C15.2963 5.85185 15.037 5.75 14.7222 5.75C14.4074 5.75 14.1481 5.85185 13.9444 6.05555L8.44444 11.5556ZM2.22222 20C1.61111 20 1.08815 19.7826 0.653333 19.3478C0.218519 18.913 0.000740741 18.3896 0 17.7778V2.22222C0 1.61111 0.217778 1.08815 0.653333 0.653333C1.08889 0.218519 1.61185 0.000740741 2.22222 0H17.7778C18.3889 0 18.9122 0.217778 19.3478 0.653333C19.7833 1.08889 20.0007 1.61185 20 2.22222V17.7778C20 18.3889 19.7826 18.9122 19.3478 19.3478C18.913 19.7833 18.3896 20.0007 17.7778 20H2.22222Z" fill="#1EC51E" />
      </g>
      <defs>
        <clipPath id="results-mistakes-correct-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BulletList({
  items,
  icon,
}: {
  items: { title: string; body: string }[];
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">{icon}</div>
          <p className="text-[18px] font-normal leading-[1.55] tracking-[-0.1px] text-[#121212]">
            <span className="font-semibold">{item.title}</span> {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function InfoCard({
  title,
  borderColor,
  children,
}: {
  title: string;
  borderColor: string;
  children: ReactNode;
}) {
  return (
    <article
      className="mx-auto w-full max-w-[390px] rounded-2xl bg-white px-5 py-6 shadow-[0_12px_30px_rgba(18,18,18,0.06)] md:min-h-[360px] md:max-w-[544px] md:px-7 md:py-8"
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      <h3 className="mb-6 text-[28px] font-extrabold leading-[1.2] tracking-[-0.3px] text-[#121212] md:mb-7">
        {title}
      </h3>
      {children}
    </article>
  );
}

export const ResultsMistakes = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="flex w-full justify-center bg-white py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="text-[26px] font-extrabold capitalize leading-[1.2] tracking-[-0.5px] text-[#121212] md:text-[44px]">
            What Most People Get Wrong
          </h2>
          <p className="mx-auto mt-4 max-w-[860px] text-[18px] font-normal leading-[1.55] tracking-[-0.1px] text-[#121212] md:text-[20px]">
            Not all hair systems are created equal. Here's why cheap alternatives fail, and why American Hairline succeeds.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1120px] grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          <InfoCard title="Common Mistakes" borderColor="#FB2C36">
            <BulletList items={mistakes} icon={<WrongIcon />} />
          </InfoCard>

          <InfoCard title="Our Approach" borderColor="#1EC51E">
            <BulletList items={approach} icon={<CorrectIcon />} />
          </InfoCard>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
