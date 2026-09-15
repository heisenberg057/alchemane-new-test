'use client';

import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Plus, Lightbulb, ArrowUpRight } from 'lucide-react';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { Achievements } from '@/components/homepage/Achievements';
import { ACHIEVEMENT_ASSETS } from '@/components/homepage/achievementsAssets';
import { SocialProof } from '@/components/homepage/SocialProof';
import { ResultsTransformations } from '@/components/results/ResultsTransformations';
import { Checklist } from '@/components/homepage/Checklist';
import { Gallery } from '@/components/hair-patch-vs-hair-system/HairPatchClients';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { STICK_ON_CONSULTATION_ASSETS, STICK_ON_DETAIL_HERO_ASSETS, STICK_ON_LEARN_CLIP_ON_ASSETS, STICK_ON_LOCAL_FAIL_ASSETS, STICK_ON_SIGNATURE_HAIRLINE_ASSETS, STICK_ON_ZYCON_ASSETS } from './stickOnHairSystemAssets';

const SHARK_TANK_ACHIEVEMENT_IMAGE = ACHIEVEMENT_ASSETS[0].desktopImageSrc;

const achievementItems = [
  { id: 1, image: SHARK_TANK_ACHIEVEMENT_IMAGE, label: "Offered a deal on Shark Tank India", isSharkTank: true },
  { id: 2, image: "/assets/transplant-dr-ashutosh.png", label: "Dr. Ashutosh", isSharkTank: false },
  { id: 3, image: "/assets/transplant-dr-vinod.png", label: "Dr. Vinod", isSharkTank: false },
  { id: 4, image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png", label: "Amit's Transformation", isSharkTank: false },
];

// ── Shared ArrowButton ────────────────────────────────────────────────────────
function ArrowButton({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right'; onClick: () => void; disabled: boolean; gradientId: string;
}) {
  const arrowPath = direction === 'left'
    ? 'M18.666 24L10.666 16L18.666 8'
    : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
      style={{
        width: 56, height: 56, border: 'none', padding: 0, flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="28" cy="28" r="28" fill={`url(#${gradientId})`} />}
        <svg x="12" y="12" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d={arrowPath}
            stroke={disabled ? 'rgba(18,18,18,0.4)' : 'white'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </svg>
    </button>
  );
}

const consultationSteps = [
  { id: 1, title: "We Check Your Scalp", description: "We assess your scalp condition and the level of hair loss (Norwood scale).", icon: "👀", image: STICK_ON_CONSULTATION_ASSETS.checkScalp },
  { id: 2, title: "We Show You Options", description: "You'll see different base types, and we'll explain the pros and cons of each.", icon: "🧩", image: STICK_ON_CONSULTATION_ASSETS.showOptions },
  { id: 3, title: "We Recommend What Fits You", description: "We suggest the system that best fits your scalp, lifestyle, and preferences.", icon: "🎯", image: STICK_ON_CONSULTATION_ASSETS.recommend },
  { id: 4, title: "We Design It For You", description: "We design the perfect system and color to match your natural hair.", icon: "🎨", image: STICK_ON_CONSULTATION_ASSETS.design },
];

function ServicingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[32px] w-[32px] flex-shrink-0 md:h-[48px] md:w-[48px]" viewBox="0 0 48 48" fill="none">
      <g clipPath="url(#stick-perfect-servicing-clip)">
        <path d="M24 0.0703125C10.746 0.0703125 0 10.7843 0 23.9963C0 37.2083 10.746 47.9223 24 47.9223C37.256 47.9223 48 37.2083 48 23.9963C48 10.7843 37.254 0.0703125 24 0.0703125ZM22.918 9.67031C26.738 9.41031 30.67 10.4603 33.782 13.5383C36.634 16.4123 38.802 20.4183 38.758 24.1723H43.024L34.136 34.0983L25.246 24.1723H29.872C29.87 20.7243 29.018 18.6883 26.312 16.0203C23.662 13.3483 20.978 11.8003 16.356 11.4143C18.4171 10.4336 20.6419 9.84098 22.918 9.67031ZM13.868 13.8963L22.758 23.8223H18.132C18.132 27.2703 18.984 29.3063 21.688 31.9743C24.34 34.6463 27.022 36.1983 31.644 36.5843C26.276 39.1203 19.204 39.3803 14.224 34.4563C11.37 31.5823 9.2 27.5763 9.246 23.8223H4.976L13.868 13.8963Z" fill="url(#stick-perfect-servicing-gradient)" />
      </g>
      <defs>
        <linearGradient id="stick-perfect-servicing-gradient" x1="2.59027" y1="-10.6716" x2="58.8574" y2="2.89636" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <clipPath id="stick-perfect-servicing-clip">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CalendarServiceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[32px] w-[32px] flex-shrink-0 md:h-[48px] md:w-[48px]" viewBox="0 0 48 48" fill="none">
      <path d="M15.5016 4.99219C15.5016 4.16377 14.8301 3.49219 14.0016 3.49219C13.1732 3.49219 12.5016 4.16377 12.5016 4.99219V8.15071C9.62298 8.38121 7.73318 8.94693 6.34478 10.3353C4.95638 11.7237 4.39066 13.6135 4.16016 16.4922H43.843C43.6126 13.6135 43.0468 11.7237 41.6584 10.3353C40.27 8.94693 38.3802 8.38121 35.5016 8.15071V4.99219C35.5016 4.16377 34.83 3.49219 34.0016 3.49219C33.1732 3.49219 32.5016 4.16377 32.5016 4.99219V8.01799C31.171 7.99219 29.6796 7.99219 28.0016 7.99219H20.0016C18.3236 7.99219 16.8322 7.99219 15.5016 8.01799V4.99219Z" fill="url(#stick-perfect-calendar-top)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.00781 24C4.00781 22.322 4.00781 20.8306 4.03361 19.5H43.982C44.0078 20.8306 44.0078 22.322 44.0078 24V28C44.0078 35.5424 44.0078 39.3138 41.6646 41.6568C39.3216 44 35.5502 44 28.0078 44H20.0078C12.4653 44 8.69411 44 6.35095 41.6568C4.00781 39.3138 4.00781 35.5424 4.00781 28V24ZM34.0078 28C35.1124 28 36.0078 27.1046 36.0078 26C36.0078 24.8954 35.1124 24 34.0078 24C32.9032 24 32.0078 24.8954 32.0078 26C32.0078 27.1046 32.9032 28 34.0078 28ZM34.0078 36C35.1124 36 36.0078 35.1046 36.0078 34C36.0078 32.8954 35.1124 32 34.0078 32C32.9032 32 32.0078 32.8954 32.0078 34C32.0078 35.1046 32.9032 36 34.0078 36ZM26.0078 26C26.0078 27.1046 25.1124 28 24.0078 28C22.9032 28 22.0078 27.1046 22.0078 26C22.0078 24.8954 22.9032 24 24.0078 24C25.1124 24 26.0078 24.8954 26.0078 26ZM26.0078 34C26.0078 35.1046 25.1124 36 24.0078 36C22.9032 36 22.0078 35.1046 22.0078 34C22.0078 32.8954 22.9032 32 24.0078 32C25.1124 32 26.0078 32.8954 26.0078 34ZM14.0078 28C15.1124 28 16.0078 27.1046 16.0078 26C16.0078 24.8954 15.1124 24 14.0078 24C12.9033 24 12.0078 24.8954 12.0078 26C12.0078 27.1046 12.9033 28 14.0078 28ZM14.0078 36C15.1124 36 16.0078 35.1046 16.0078 34C16.0078 32.8954 15.1124 32 14.0078 32C12.9033 32 12.0078 32.8954 12.0078 34C12.0078 35.1046 12.9033 36 14.0078 36Z" fill="url(#stick-perfect-calendar-body)" />
      <defs>
        <linearGradient id="stick-perfect-calendar-top" x1="6.3016" y1="0.57391" x2="38.296" y2="24.0515" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <linearGradient id="stick-perfect-calendar-body" x1="6.16637" y1="14.0002" x2="49.1595" y2="30.874" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SecureShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[32px] w-[32px] flex-shrink-0 md:h-[48px] md:w-[48px]" viewBox="0 0 48 48" fill="none">
      <path d="M42.8248 0.480469H5.19289C3.11452 0.480469 1.42969 2.16531 1.42969 4.24365V17.4148C1.42969 29.8145 7.43197 37.3292 12.4676 41.4498C17.8913 45.8857 23.2868 47.391 23.522 47.4545C23.8454 47.5425 24.1864 47.5425 24.5098 47.4545C24.745 47.391 30.1334 45.8857 35.5642 41.4498C40.5857 37.3292 46.588 29.8145 46.588 17.4148V4.24365C46.588 2.16531 44.9031 0.480469 42.8248 0.480469ZM34.7527 16.8645L21.5816 30.0356C20.8466 30.7714 19.6541 30.7714 18.9191 30.0356L13.2743 24.3908C12.2495 23.3661 12.7184 21.6162 14.1183 21.2411C14.768 21.067 15.4612 21.2528 15.9368 21.7284L20.2456 26.0443L32.0856 14.202C33.1104 13.1772 34.8602 13.6461 35.2353 15.046C35.4094 15.6956 35.2236 16.3889 34.748 16.8645H34.7527Z" fill="url(#stick-perfect-shield-gradient)" />
      <defs>
        <linearGradient id="stick-perfect-shield-gradient" x1="3.86661" y1="-10.0792" x2="57.0483" y2="2.19384" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TransplantLikeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[32px] w-[32px] flex-shrink-0 md:h-[48px] md:w-[48px]" viewBox="0 0 48 48" fill="none">
      <path d="M2.73732 45.9593C2.24508 45.9593 1.83256 45.7927 1.49977 45.4595C1.16659 45.1267 1 44.7142 1 44.2219V23.9532C1 22.9977 1.34032 22.1796 2.02096 21.499C2.70122 20.8187 3.51911 20.4786 4.47464 20.4786H15.4777C15.7047 20.4786 15.9247 20.5228 16.1378 20.6112C16.3506 20.7 16.5351 20.8255 16.6915 20.9876C16.8475 21.1501 16.9737 21.3383 17.0702 21.5522C17.1667 21.7665 17.215 21.9877 17.215 22.2159V25.1114C17.215 27.0418 17.8906 28.6825 19.2419 30.0338C20.5931 31.3851 22.2339 32.0607 24.1643 32.0607C26.0947 32.0607 27.7354 31.3851 29.0867 30.0338C30.438 28.6825 31.1135 27.0418 31.1135 25.1114V22.2159C31.1135 21.9889 31.1578 21.7688 31.2462 21.5557C31.335 21.3429 31.4604 21.1584 31.6226 21.0021C31.7851 20.8461 31.9733 20.7198 32.1872 20.6233C32.4015 20.5269 32.6227 20.4786 32.8509 20.4786H43.8539C44.8094 20.4786 45.6275 20.8187 46.3081 21.499C46.9884 22.1796 47.3285 22.9977 47.3285 23.9532V44.2219C47.3285 44.7142 47.1621 45.1267 46.8293 45.4595C46.4961 45.7927 46.0834 45.9593 45.5912 45.9593H2.73732ZM24.1538 26.2696C23.6589 26.2696 23.2473 26.1031 22.9192 25.7699C22.5911 25.4371 22.4269 25.0246 22.4269 24.5323C22.4269 20.4013 22.8998 16.3476 23.8458 12.3711C24.7917 8.39454 26.8282 5.07432 29.9553 2.41043C30.3414 2.10158 30.7643 1.96703 31.2242 2.00681C31.6836 2.04657 32.0714 2.23902 32.3876 2.58416C32.6965 2.97024 32.8412 3.39491 32.8219 3.8582C32.8026 4.32148 32.5999 4.70756 32.2138 5.01641C29.4341 7.33284 27.6872 10.2536 26.9729 13.7789C26.2587 17.3037 25.9016 20.8882 25.9016 24.5323C25.9016 25.0246 25.734 25.4371 25.3989 25.7699C25.0642 26.1031 24.6492 26.2696 24.1538 26.2696ZM9.6866 33.2189C10.1885 33.2189 10.6036 33.0548 10.9317 32.7267C11.2598 32.3986 11.4239 31.9834 11.4239 31.4816C11.4239 30.9797 11.2598 30.5646 10.9317 30.2365C10.6036 29.9084 10.1885 29.7443 9.6866 29.7443C9.18474 29.7443 8.76964 29.9084 8.44152 30.2365C8.1134 30.5646 7.94928 30.9797 7.94928 31.4816C7.94928 31.9834 8.1134 32.3986 8.44152 32.7267C8.76964 33.0548 9.18474 33.2189 9.6866 33.2189ZM12.003 39.01C12.5049 39.01 12.92 38.8459 13.2481 38.5177C13.5762 38.1896 13.7403 37.7745 13.7403 37.2727C13.7403 36.7708 13.5762 36.3557 13.2481 36.0276C12.92 35.6995 12.5049 35.5353 12.003 35.5353C11.5012 35.5353 11.0861 35.6995 10.7579 36.0276C10.4298 36.3557 10.2657 36.7708 10.2657 37.2727C10.2657 37.7745 10.4298 38.1896 10.7579 38.5177C11.0861 38.8459 11.5012 39.01 12.003 39.01ZM38.6419 33.2189C39.1438 33.2189 39.5589 33.0548 39.887 32.7267C40.2151 32.3986 40.3792 31.9834 40.3792 31.4816C40.3792 30.9797 40.2151 30.5646 39.887 30.2365C39.5589 29.9084 39.1438 29.7443 38.6419 29.7443C38.1401 29.7443 37.725 29.9084 37.3968 30.2365C37.0687 30.5646 36.9046 30.9797 36.9046 31.4816C36.9046 31.9834 37.0687 32.3986 37.3968 32.7267C37.725 33.0548 38.1401 33.2189 38.6419 33.2189Z" fill="url(#stick-perfect-transplant-gradient)" />
      <defs>
        <linearGradient id="stick-perfect-transplant-gradient" x1="3.50007" y1="-7.8681" x2="57.4996" y2="5.81261" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SmileCurveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 76 40" fill="none">
      <g clipPath="url(#stick-perfect-smile-clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M71.9557 5.74734C57.691 32.5935 29.1971 43.5084 2.73188 28.3935C2.30974 28.1527 1.81071 28.0905 1.34344 28.2203C0.876173 28.3502 0.478514 28.6616 0.237051 29.0868C-0.0020246 29.5158 -0.0632084 30.0232 0.0669253 30.4978C0.197059 30.9723 0.50788 31.3752 0.931184 31.6181C29.2984 47.8335 59.892 36.2745 75.1812 7.50836C75.4102 7.0743 75.4604 6.56615 75.3206 6.09481C75.1809 5.62347 74.8627 5.2272 74.4353 4.99247C74.0068 4.76419 73.5068 4.7154 73.043 4.85658C72.5792 4.99777 72.1888 5.31765 71.9557 5.74734Z" fill="white" />
        <path d="M24.9993 16.8802C26.4142 16.8802 27.7713 16.3113 28.7718 15.2986C29.7724 14.2859 30.3345 12.9124 30.3345 11.4802C30.3345 10.048 29.7724 8.67453 28.7718 7.66183C27.7713 6.64914 26.4142 6.08021 24.9993 6.08021C23.5843 6.08021 22.2272 6.64914 21.2267 7.66183C20.2262 8.67453 19.6641 10.048 19.6641 11.4802C19.6641 12.9124 20.2262 14.2859 21.2267 15.2986C22.2272 16.3113 23.5843 16.8802 24.9993 16.8802ZM47.0869 11.1356C48.4742 11.1356 49.8047 10.5778 50.7856 9.58491C51.7666 8.59203 52.3177 7.24538 52.3177 5.84123C52.3177 4.43708 51.7666 3.09044 50.7856 2.09756C49.8047 1.10467 48.4742 0.546875 47.0869 0.546875C45.6996 0.546875 44.3691 1.10467 43.3881 2.09756C42.4072 3.09044 41.8561 4.43708 41.8561 5.84123C41.8561 7.24538 42.4072 8.59203 43.3881 9.58491C44.3691 10.5778 45.6996 11.1356 47.0869 11.1356Z" fill="white" />
      </g>
      <defs>
        <clipPath id="stick-perfect-smile-clip">
          <rect width="76" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function StickOnHairSystemPage({ schema }: { schema?: any }) {
  const [activeAchievementIndex, setActiveAchievementIndex] = useState(0);
  const [isAchievementTransitioning, setIsAchievementTransitioning] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState<number>(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const handleAchievementChange = (newIndex: number) => {
    if (isAchievementTransitioning || newIndex === activeAchievementIndex) return;
    setIsAchievementTransitioning(true);
    setActiveAchievementIndex(newIndex);
    setTimeout(() => setIsAchievementTransitioning(false), 500);
  };

  const goToPrevAchievement = () => { if (activeAchievementIndex > 0) handleAchievementChange(activeAchievementIndex - 1); };
  const goToNextAchievement = () => { if (activeAchievementIndex < achievementItems.length - 1) handleAchievementChange(activeAchievementIndex + 1); };

  // ── Mobile Achievements carousel ──────────────────────────────────────────
  // ── Consultation carousel — per-card navigation ───────────────────────────
  const {
    scrollRef: scrollContainerRef,
    activeIndex: activeConsultationStep,
    canPrev: canScrollConsultPrev,
    canNext: canScrollConsultNext,
    scrollPrev: scrollLeft,
    scrollNext: scrollRight,
    scrollToIndex: scrollToConsult,
  } = useSnapCarousel({
    itemSelector: '[data-consult-card]',
    itemCount: consultationSteps.length,
  });

  // ── Misc state ─────────────────────────────────────────────────────────────
  const testimonials = [
    { id: 1, name: "Hrithik Bahl", title: "Physical Therapist", image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-hrithik.png", quote: "As a therapist, I needed to look sharp. This system gave me that edge, naturally." },
    { id: 2, name: "Arnav Mukherjee", title: "Entrepreneur", image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-arnav.png", quote: "The confidence boost was immediate. It's not just hair, it's a lifestyle upgrade." },
    { id: 3, name: "Aryan Bera", title: "Civil Engineer", image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-aryan.png", quote: "I can wear any style I want now. The natural look is truly unbelievable." },
  ];

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [zyconOpen, setZyconOpen] = useState(false);

  // Lock body scroll when Zycon popup is open
  useEffect(() => {
    if (zyconOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [zyconOpen]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const SPEED = 40;
  const [isPausedState, setIsPausedState] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, index * 100);
          observer.unobserve(card);
        }
      }, { threshold: 0.15 });
      observer.observe(card);
      observers.push(observer);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileAnimationRef = useRef<number>(0);
  const mobileIsPausedRef = useRef<boolean>(false);
  const mobileLastTimeRef = useRef<number>(0);
  const MOBILE_SPEED = 35;

  const animate = React.useCallback((timestamp: number) => {
    if (!scrollRef.current || isPausedRef.current) { animationRef.current = requestAnimationFrame(animate); return; }
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    const el = scrollRef.current;
    el.scrollTop += (SPEED * delta) / 1000;
    if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop -= el.scrollHeight / 2;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const mobileAnimate = React.useCallback((timestamp: number) => {
    if (!mobileScrollRef.current || mobileIsPausedRef.current) { mobileAnimationRef.current = requestAnimationFrame(mobileAnimate); return; }
    if (mobileLastTimeRef.current === 0) mobileLastTimeRef.current = timestamp;
    const delta = timestamp - mobileLastTimeRef.current;
    mobileLastTimeRef.current = timestamp;
    const el = mobileScrollRef.current;
    el.scrollTop += (MOBILE_SPEED * delta) / 1000;
    if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop -= el.scrollHeight / 2;
    mobileAnimationRef.current = requestAnimationFrame(mobileAnimate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    mobileAnimationRef.current = requestAnimationFrame(mobileAnimate);
    return () => { cancelAnimationFrame(animationRef.current); cancelAnimationFrame(mobileAnimationRef.current); };
  }, [animate, mobileAnimate]);

  const handleMouseEnter = () => { isPausedRef.current = true; lastTimeRef.current = 0; setIsPausedState(true); };
  const handleMouseLeave = () => { isPausedRef.current = false; setIsPausedState(false); };
  const handleTouchStart = () => { isPausedRef.current = true; lastTimeRef.current = 0; setIsPausedState(true); };
  const handleTouchEnd = () => { setTimeout(() => { isPausedRef.current = false; setIsPausedState(false); }, 1500); };
  const handleMobileTouchStart = () => { mobileIsPausedRef.current = true; mobileLastTimeRef.current = 0; };
  const handleMobileTouchEnd = () => { setTimeout(() => { mobileIsPausedRef.current = false; }, 1500); };

  const faqItems = [
    { id: 1, question: "What is Zycon range?", answer: "The Zycon range is a stick-on hair system that supports scalp health by using antibacterial protection and controlling odor. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle." },
    { id: 2, question: "Will it fall off with sweat?", answer: "No, our medical-grade adhesives are designed to be sweat and water-resistant, ensuring your system stays secure during workouts or swimming." },
    { id: 3, question: "Will it damage my scalp?", answer: "Not at all. We use breathable, skin-friendly materials and medical-grade bonding agents that are safe for long-term wear." },
    { id: 4, question: "How often servicing?", answer: "We generally recommend a service every 3-4 weeks to clean the scalp, re-bond the system, and trim your natural hair." },
    { id: 5, question: "Can I style it?", answer: "Absolutely! You can cut, wash, and style it just like your own hair. Gel, wax, or spray – it's all good." },
    { id: 6, question: "Will my partner notice?", answer: "Our systems are designed to be undetectable, even up close. The hairline and density are matched perfectly to look completely natural." },
  ];

  const checklistItems = [
    { id: 1, title: "Hair Colour Match", description: "Strand-to-strand precision, no visible mismatch" },
    { id: 2, title: "Hair Strand Diameter", description: "Fine / Medium / Coarse, matched to native texture" },
    { id: 3, title: "Wave Type", description: "Straight / Soft wave / Body wave / Defined curls" },
    { id: 4, title: "Hairline Shape", description: "Straight / M-curve / Rounded / Slight recession" },
    { id: 5, title: "Hairline Density", description: "Low / Medium / High (especially front 1 inch)" },
    { id: 6, title: "Hairline Direction", description: "Brush back / Left-right / Natural fall (starting point)" },
    { id: 7, title: "Whorl Area / Crown Design", description: "Clockwise / Anti-clockwise / Flat crown realism" },
    { id: 8, title: "Overall Hair Direction", description: "Forward / Side / Backward, aligned to natural growth" },
    { id: 9, title: "Knotting Technique at Root", description: "V-loop / Injected / Single / Double secure knots" },
    { id: 10, title: "Bleached Knots / No Knot Visibility", description: "Invisible roots / Lightened knots for scalp realism" },
    { id: 11, title: "Base Type", description: "Swiss lace / PU / Hybrid / Mono / Lace front PU back" },
    { id: 12, title: "Base Colour / Scalp Tint", description: "PU tone matched exactly to real scalp shade" },
    { id: 13, title: "Ventilation Technique", description: "Flat / Semi-lift / Elevated, controls lift & volume" },
    { id: 14, title: "Baby Hair Addition", description: "Short / Wispy / Slightly irregular to soften hairline edge" },
    { id: 15, title: "Clip-on / Stick-on Selection", description: "Temporary / Semi-permanent / Lifestyle-fit for daily wear" },
    { id: 16, title: "Scalp Mold Accuracy", description: "POP mold or digital for exact fit (not estimation)" },
    { id: 17, title: "Right Hairstyle", description: "Based on face structure (quiff, pompadour, classic, messy)" },
    { id: 18, title: "Right Haircut", description: "Layering, tapering, fade, texture blend into side/back" },
    { id: 19, title: "Frontal Transition Zone", description: "Gradual / Jagged / Slightly uneven to mimic real hair" },
    { id: 20, title: "Grey Hair Percentage (if any)", description: "Light / Scattered / Blended strands to mimic natural aging" },
    { id: 21, title: "Fade Compatibility", description: "Side/back blending to match skin fade / temple fade" },
  ];

  const mobileAchievementItems = [
    { id: 1, image: SHARK_TANK_ACHIEVEMENT_IMAGE, label: "Offered a deal on Shark Tank India" },
    { id: 2, image: "/assets/transplant-dr-ashutosh.png", label: "Winner of Bharat Innovators Award" },
    { id: 3, image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-stick-on-actor-achievement.png", label: "Designed For Bollywood Celebrities" },
    { id: 4, image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png", label: "Uses Advanced 3D Scan Technology" },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px] max-w-[1440px] mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-[11px] py-[5px] bg-[#F3F6FF] border border-[#1212120D] rounded-md mb-3">
          <div className="relative w-6 h-6"><Image src="/assets/stick-on-icon.svg" alt="Tape Icon" fill className="object-contain" /></div>
          <span className="text-[#1769FF] text-[14px] font-medium leading-[20px] tracking-[0.06px]">Stick-On Method</span>
        </div>
        <h1 className="text-[#121212] text-center text-[32px] md:text-[64px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[965px] mb-4">
          The Closest Thing to a Hair Transplant – No-Surgery Solution
        </h1>
        <p className="text-[#121212] text-center text-[18px] md:text-[20px] leading-[31px] tracking-[-0.1px] max-w-[763px] mb-[44px]">
          <span className="font-medium">Invisible. </span><span className="font-bold">Secure</span><span className="font-medium">. Skin-safe adhesive.<br className="hidden md:block" />Bonds to a shaved area using </span><span className="font-bold">medical-grade</span><span className="font-medium"> tape or glue for a </span><span className="font-bold">natural hairline</span><span className="font-medium"> and long-lasting hold. Breathable and </span><span className="font-bold">water-resistant</span><span className="font-medium">, so you can shower, sleep, or workout with </span><span className="font-bold">confidence</span><span className="font-medium">.</span>
        </p>
        <div className="relative w-full max-w-[1120px] overflow-hidden rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
          <div className="relative hidden aspect-[16/9] w-full md:block">
            <Image
              src={STICK_ON_DETAIL_HERO_ASSETS.desktop.src}
              alt={STICK_ON_DETAIL_HERO_ASSETS.desktop.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1120px, calc(100vw - 80px)"
              fetchPriority="high"
            />
          </div>
          <div className="relative aspect-[117/146] w-full md:hidden">
            <Image
              src={STICK_ON_DETAIL_HERO_ASSETS.mobile.src}
              alt={STICK_ON_DETAIL_HERO_ASSETS.mobile.alt}
              fill
              priority
              className="object-cover"
              sizes="calc(100vw - 32px)"
            />
          </div>
        </div>
      </section>

      {/* Why Most Local Hair Systems Fail */}
      <section className="bg-[#F5F6F7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-[64px] md:px-10 md:py-[120px] xl:px-[160px]">
          <h2 className="text-[#121212] text-center text-[32px] md:text-[44px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[408px] mb-[44px]">Why Most Local Hair Systems Fail</h2>
          <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:items-stretch">
            <div className="w-full max-w-[434px] md:max-w-[544px]">
              <div className="relative h-[205px] w-full overflow-hidden rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] md:hidden">
                <Image
                  src={STICK_ON_LOCAL_FAIL_ASSETS.mobile.src}
                  alt={STICK_ON_LOCAL_FAIL_ASSETS.mobile.alt}
                  fill
                  className="object-cover"
                  sizes="334px"
                />
              </div>
              <div className="relative hidden h-[408px] w-full overflow-hidden rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] md:block">
                <Image
                  src={STICK_ON_LOCAL_FAIL_ASSETS.desktop.src}
                  alt={STICK_ON_LOCAL_FAIL_ASSETS.desktop.alt}
                  fill
                  className="object-cover"
                  sizes="544px"
                />
              </div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-5 lg:w-auto">
              <div className="flex h-full flex-col justify-center gap-4 rounded-[16px] border border-[#12121214] bg-white p-6 shadow-[0px_8px_24px_0px_#0000000D] lg:p-[23px]">
                <h3 className="text-[#121212] text-[20px] font-semibold leading-[24px] tracking-[-0.1px]">Why It Looks Fake:</h3>
                <div className="flex flex-col gap-5">
                  {["The base is <b>too thick</b>, so it doesn't sit flat on the scalp.", "The hair density is <b>uneven</b>, so it looks \"placed,\" not natural.", "<b>Cheap glue</b> causes itching and starts peeling with sweat.", "After a few weeks, the system <b>looks fake</b> and loses shape.", "The hair texture and hairline <b>look unnatural</b> and aren't designed for you."].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#121212] mt-2.5 flex-shrink-0" />
                      <p className="text-[#121212] text-[18px] leading-[27px] tracking-[-0.16px]" dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                  ))}
                </div>
              </div>
              <a href="/contact-us" className="flex items-center justify-center gap-2 w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity">
                <span className="text-white text-[18px] font-semibold leading-[25px] tracking-[0.2px]">Talk To An Expert</span>
                <div className="relative w-7 h-7"><Image src="/assets/icon-arrow-up-right-white.svg" alt="Arrow Icon" fill className="object-contain" /></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Process Section */}
      <section className="py-[64px] md:py-[120px] bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
          <h2 className="text-[#121212] text-[26px] md:text-[44px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[600px] mb-4 capitalize">
            At American Hairline, We Don't Do One-Size-Fits-All
          </h2>
          <p className="text-[#555555] text-[16px] font-semibold leading-[1.24] tracking-[-0.1px] mb-[44px]">Here's what happens during your consultation:</p>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-[16px] overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {consultationSteps.map((step) => (
                <div
                  key={step.id}
                  data-consult-card
                  className="relative snap-start flex-shrink-0 w-[260px] h-[480px] md:w-[352px] md:h-[644px] overflow-hidden rounded-[12px] bg-white"
                  style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.06)' }}
                >
                  <Image
                    src={step.image.desktop.src}
                    alt={step.image.desktop.alt}
                    fill
                    className="hidden object-cover object-center md:block"
                    sizes="352px"
                  />
                  <Image
                    src={step.image.mobile.src}
                    alt={step.image.mobile.alt}
                    fill
                    className="object-cover object-center md:hidden"
                    sizes="260px"
                  />
                  <div className="relative z-10 p-[20px_20px_0px] md:p-[24px_24px_0px]">
                    <div className="text-[36px] leading-none mb-[14px]">{step.icon}</div>
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#121212] leading-[1.2] tracking-[-0.1px] mb-[6px]">{step.title}</h3>
                    <p className="max-w-[220px] md:max-w-[280px] text-[#555555] text-[13px] md:text-[14px] font-normal leading-[1.4] tracking-[-0.1px]">{step.description}</p>
                  </div>
                </div>
              ))}
              <div className="hidden md:block w-4 flex-shrink-0" />
            </div>

            {/* MOBILE controls — ← | dots pill | → */}
            <div className="flex md:hidden items-center justify-center gap-3 mt-8">
              <ArrowButton direction="left" onClick={scrollLeft} disabled={!canScrollConsultPrev} gradientId="stick-consult-mobile-left" />
              <div
                className="flex items-center justify-center gap-[8px] flex-shrink-0"
                style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)', WebkitBackdropFilter: 'blur(3.5px)' }}
              >
                {consultationSteps.map((_, i) => (
                  <button key={i} onClick={() => scrollToConsult(i)} style={{
                    width: i === activeConsultationStep ? 32 : 8, height: 8, borderRadius: 999,
                    background: i === activeConsultationStep ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
                  }}/>
                ))}
              </div>
              <ArrowButton direction="right" onClick={scrollRight} disabled={!canScrollConsultNext} gradientId="stick-consult-mobile-right" />
            </div>

            {/* DESKTOP nav — bottom right, blue until exhausted */}
            <div className="hidden md:flex items-center justify-end gap-3 mt-6">
              <ArrowButton direction="left" onClick={scrollLeft} disabled={!canScrollConsultPrev} gradientId="stick-consult-desktop-left" />
              <ArrowButton direction="right" onClick={scrollRight} disabled={!canScrollConsultNext} gradientId="stick-consult-desktop-right" />
            </div>
          </div>
        </div>
      </section>

      {/* Signature Hairline Section */}
      <section className="bg-[#F5F6F7]">
        {/* DESKTOP */}
        <div className="mx-auto hidden max-w-[1440px] flex-col items-center px-4 py-[64px] md:px-10 md:py-[120px] xl:px-[160px] lg:flex">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">Our Ultra-Signature Natural<br className="hidden md:block" /> Hairline, Just For You</h2>
          <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:items-stretch">
            <div className="flex flex-col gap-5 w-full lg:max-w-[544px]">
              <div className="bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 lg:p-[32px] flex flex-col gap-5 h-full min-h-[332px]">
                <h3 className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">The hairline is the ultimate test. Most patches fail here. At American Hairline, we specialize in:</h3>
                <div className="flex flex-col gap-5">
                  {["Ultra-thin lace fronts.", "Customized hairline shapes to match your younger self.", "Graduated density hair looks like it grows from your scalp.", "Blending cuts that merge seamlessly."].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="relative w-5 h-5 mt-[3px] flex-shrink-0"><Image src="/assets/transplant-check.svg" alt="Check" fill className="object-contain" /></div>
                      <p className="text-[18px] text-[#121212] leading-[26px] font-medium tracking-[-0.16px]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/contact-us" className="w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] flex items-center justify-center gap-2 shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity">
                <span className="text-white font-semibold text-[18px] leading-[25px] tracking-[0.2px]">Talk to an Expert</span>
                <div className="relative w-7 h-7"><Image src="/assets/icon-arrow-up-right-white.svg" alt="Arrow" fill className="object-contain" /></div>
              </a>
            </div>
            <div className="relative h-[408px] w-full max-w-[544px] overflow-hidden rounded-[16px] bg-gray-200">
              <Image
                src={STICK_ON_SIGNATURE_HAIRLINE_ASSETS.desktop.src}
                fill
                className="object-cover"
                alt={STICK_ON_SIGNATURE_HAIRLINE_ASSETS.desktop.alt}
                sizes="544px"
              />
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex flex-col items-center px-4 py-[64px] lg:hidden">
          <h2 className="text-[28px] font-extrabold text-[#121212] leading-[34px] tracking-[-0.5px] mb-[32px] text-left w-full max-w-[358px]">Our Ultra-Signature Natural<br />Hairline, Just for You</h2>
          <div className="w-full max-w-[358px] bg-white rounded-[12px] shadow-[0px_8px_24px_0px_#0000000D] p-[12px_12px_28px] flex flex-col items-center">
            <div className="relative h-[205px] w-full max-w-[334px] rounded-[8px] overflow-hidden mb-[32px]">
              <Image
                src={STICK_ON_SIGNATURE_HAIRLINE_ASSETS.mobile.src}
                fill
                className="object-cover"
                alt={STICK_ON_SIGNATURE_HAIRLINE_ASSETS.mobile.alt}
                sizes="334px"
              />
            </div>
            <div className="w-full px-0">
              <p className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px] mb-[20px]">The hairline is the ultimate test. Most patches fail here. At American Hairline, we specialize in:</p>
              <div className="flex flex-col gap-[12px]">
                {["Ultra-thin lace fronts.", "Customized hairline shapes to match your younger self.", "Graduated density hair looks like it grows from your scalp.", "Blending cuts that merge seamlessly."].map((item, i) => (
                  <div key={i} className="flex items-start gap-[6px]">
                    <div className="relative w-[20px] h-[20px] mt-[2px] flex-shrink-0"><Image src="/assets/transplant-check.svg" alt="Check" fill className="object-contain" /></div>
                    <p className="text-[16px] font-medium text-[#121212] leading-[24px] tracking-[-0.16px]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center mt-[32px] mb-[32px] max-w-[318px]">
            <span className="text-[#121212] text-opacity-50 text-[16px] font-medium leading-[21px] tracking-[-0.25px]">Even under harsh light, the Stick-On system hairline looks like a </span>
            <span className="text-[#121212] text-[16px] font-medium leading-[21px] tracking-[-0.25px]">natural transplant,<br />not a wig.</span>
          </p>
          <a href="/contact-us" className="w-full max-w-[358px] h-[52px] rounded-[8px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] flex items-center justify-center gap-[8px] shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity">
            <span className="text-white font-semibold text-[18px] leading-[25px] tracking-[1px]">Talk to an Expert</span>
            <div className="relative w-[28px] h-[28px]"><Image src="/assets/icon-arrow-up-right-white.svg" alt="Arrow" fill className="object-contain" /></div>
          </a>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-white py-[64px] md:py-[80px] lg:py-[120px]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-[32px] px-[20px] md:px-[60px] lg:flex-row lg:gap-0 lg:px-[160px]">
          <div className="w-full self-start lg:sticky lg:top-32 lg:w-[444px]">
            <h2 className="w-full text-center text-[32px] font-extrabold leading-tight tracking-[-0.5px] text-[#121212] md:text-[44px] lg:w-[444px] lg:text-left lg:leading-[53px]">Stick-On Is Perfect For Men Who...</h2>
          </div>
          <div className="flex w-full flex-col gap-[16px] lg:w-[576px]">
            {[
              { icon: <ServicingIcon />, text: "Doesn't want the hassle of daily clip-on system wear and removal." },
              { icon: <CalendarServiceIcon />, text: "Open to servicing every 20–25 days (haircut, cleaning, re-fixing)." },
              { icon: <SecureShieldIcon />, text: "Need a secure, activity-proof solution that stays firmly in place." },
              { icon: <TransplantLikeIcon />, text: "Want a solution that's as close to a hair transplant as possible." },
            ].map((card, idx) => (
              <div key={idx} ref={(el) => { cardRefs.current[idx] = el; }}
                style={{ opacity: 0, transform: 'translateY(40px)', transition: `opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 100}ms, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 100}ms` }}
                className="flex min-h-[112px] items-center gap-[16px] rounded-[16px] border border-[#12121214] bg-white p-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] lg:min-h-[136px] lg:gap-[24px] lg:pl-[31px] lg:pr-[12px]"
              >
                <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[12px] bg-[rgba(23,105,255,0.10)] p-[10px] md:h-[72px] md:w-[72px] md:p-[12px]">{card.icon}</div>
                <p className="w-full text-[16px] font-medium leading-snug tracking-[-0.25px] text-[#121212] lg:w-[410px] lg:text-[24px] lg:leading-[34px]">{card.text}</p>
              </div>
            ))}
            <div ref={(el) => { cardRefs.current[4] = el; }}
              style={{ opacity: 0, transform: 'translateY(40px)', transition: 'opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 400ms, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 400ms' }}
              className="relative flex min-h-[196px] w-full flex-col overflow-hidden rounded-[16px] border border-[#12121214] bg-[linear-gradient(125.4deg,#4686fe_-1.21%,#1769ff_101.21%)] p-[24px] lg:min-h-[164px] lg:w-[576px] lg:flex-row lg:items-start lg:gap-[36px] lg:p-[24px_28px_24px_31px]"
            >
              <div className="relative mb-[14px] h-[26px] w-[50px] flex-shrink-0 lg:mb-0 lg:mt-[7px] lg:h-[40px] lg:w-[76px]">
                <SmileCurveIcon />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="mb-[10px] text-[20px] font-bold leading-[25px] tracking-[-0.5px] text-white lg:mb-[4px] lg:text-[26px] lg:leading-[31px]">If this sounds like YOU,<br />Stick-On is made for YOU.</h3>
                <p className="mb-[18px] w-full text-[14px] font-normal leading-[20px] tracking-[-0.16px] text-white lg:mb-[12px] lg:w-[360px]">It's secure, easy to apply, and looks just like your real hair.</p>
                <a href="/contact-us" className="flex items-center gap-[8px] rounded-[8px] bg-white px-[16px] py-[8px] transition-opacity hover:bg-opacity-90 lg:inline-flex lg:py-[10px] lg:pl-[20px] lg:pr-[12px]">
                  <span className="text-[#121212] font-semibold text-[14px] leading-[18px] tracking-[-0.1px]">Talk to an Expert</span>
                  <div className="relative w-[22px] h-[24px]"><Image src="/assets/hair-patch-arrow-up-right-black.svg" alt="Arrow" fill className="object-contain" /></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Achievements Section */}
      <Achievements />

      {/* 21-Point Checklist Section */}
      <Checklist />

      <SocialProof />

      {/* Why Choose American Hairline */}
      <section className="bg-white py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">Why Thousands Of Men<br />Choose American Hairline</h2>
          <div className="flex flex-col gap-6 w-full max-w-[1120px]">
            {[
              ["First in India with <b>Antimicrobial Base</b> Technology for Scalp Safety", "<b>Medical-grade adhesives</b> from the USA for bonding (not cheap glues)"],
              ["Signature <b>natural hairline</b> artistry", "6700+ <b>custom systems</b> designed in 12+ countries"],
            ].map((row, ri) => (
              <div key={ri} className="flex flex-col lg:flex-row gap-6 w-full">
                {row.map((text, ci) => (
                  <div key={ci} className="flex items-center gap-4 p-6 bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] w-full lg:w-1/2 min-h-[80px]">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#1769FF] rounded-[4px] flex items-center justify-center">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-[20px] text-[#121212] leading-[28px] tracking-[-0.1px]" dangerouslySetInnerHTML={{ __html: text }} />
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-center w-full">
              <div className="flex items-center gap-4 p-6 bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] w-full lg:w-[60%] min-h-[80px]">
                <div className="flex-shrink-0 w-6 h-6 bg-[#1769FF] rounded-[4px] flex items-center justify-center">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[20px] text-[#121212] leading-[28px] tracking-[-0.1px]"><span className="font-bold">Exclusive creators</span> of Zycon™ range in India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zycon Range Promo */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative w-full max-w-[358px] md:max-w-[1120px] mx-auto h-[583px] rounded-[20px] bg-white shadow-[0px_8px_24px_0px_#0000000D] border border-[#12121214]" style={{ overflow: 'visible' }}>
            {/* gradient + content clipped inside */}
            <div className="absolute inset-0 rounded-[20px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4686FE] via-[#E052A0] to-[#FF4D4D]" />
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center">
                <div className="relative z-20 flex flex-col justify-start md:justify-center px-6 pt-12 md:pt-0 md:pl-[80px] w-full md:w-1/2 h-full">
                  <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white w-fit mb-4 shadow-sm">
                    <span className="text-[#555555] text-[12px] md:text-[16px] font-bold leading-[16px] tracking-[-0.12px] uppercase">Zycon Range • Pro Series</span>
                  </div>
                  <h2 className="text-white text-[32px] md:text-[48px] font-extrabold leading-[1.1] tracking-[-0.5px] max-w-[575px]">
                    Premium Stick-On<br /><span className="text-[#121212]">With Medicated <br className="md:hidden" /> Hygiene</span>
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-10 flex h-full items-end justify-center overflow-hidden md:static md:w-1/2 md:justify-end">
                  <div className="relative mt-auto h-[852px] w-[479px] -translate-y-[270px] max-w-[78vw] md:mr-[-24px] md:h-[1064px] md:w-[598px] md:-translate-y-[456px]">
                    <Image
                      src={STICK_ON_ZYCON_ASSETS.card.desktop.src}
                      alt={STICK_ON_ZYCON_ASSETS.card.desktop.alt}
                      fill
                      className="hidden object-contain object-bottom md:block"
                      sizes="598px"
                    />
                    <Image
                      src={STICK_ON_ZYCON_ASSETS.card.mobile.src}
                      alt={STICK_ON_ZYCON_ASSETS.card.mobile.alt}
                      fill
                      className="object-contain object-bottom md:hidden"
                      sizes="479px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* + button — absolute to the card, outside overflow:hidden, always visible */}
            <div className="absolute bottom-5 right-5 z-30 group" style={{ pointerEvents: 'auto' }}>
              <button
                onClick={() => setZyconOpen(true)}
                style={{ width: 44, height: 44, borderRadius: '50%', background: '#1769FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 right-0 w-max bg-white px-3 py-1.5 rounded-[4px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-black text-[12px] font-semibold">Tap to read more</span>
                <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">Local Patches Vs Our Patches</h2>
          <div className="w-full max-w-[992px] border border-[#E5E7EB] rounded-[12px] shadow-[0px_8px_24px_0px_#0000000D] overflow-hidden">
            <div className="flex bg-[#121212] text-white">
              {["Feature","Local Patches","Our Patches"].map((h,i) => <div key={i} className={`flex-1 py-11 text-center text-[20px] md:text-[28px] font-bold leading-[28px] tracking-[-0.25px] ${i<2?'border-r border-[#1212121F]':''}`}>{h}</div>)}
            </div>
            {[
              { feature:"Base Thickness", local:"Thick and visible", our:"Super-thin and invisible", isGray:false },
              { feature:"Look & Hairline", local:"Wiggy and obvious", our:"Natural, like a transplant", isGray:true },
              { feature:"Density / Texture", local:"Mismatched and generic", our:"Custom to scalp & age", isGray:false },
              { feature:"Scalp Safety", local:"Cheap adhesives", our:"Uses Safe, medical-grade bonding", isGray:true },
              { feature:"Hygiene", local:"Traps sweat and bacteria", our:"Antimicrobial and odor-free", isGray:false },
              { feature:"Security", local:"Loosens with sweat", our:"Activity-proof: gym, swim, running", isGray:true },
              { feature:"Longevity", local:"Looks fake quickly", our:"Natural look, lasts until next service", isGray:false },
            ].map((row,i) => (
              <div key={i} className={`flex ${row.isGray?'bg-[#F9FAFB]':'bg-white'} border-b border-[#E5E7EB] last:border-b-0`}>
                <div className="flex-1 py-11 px-4 text-center text-[18px] md:text-[20px] font-bold text-[#121212] leading-[24px] tracking-[-0.25px] border-r border-[#E5E7EB]">{row.feature}</div>
                <div className="flex-1 py-11 px-4 text-center text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.16px] border-r border-[#E5E7EB]">{row.local}</div>
                <div className="flex-1 py-11 px-4 text-center text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.16px]">{row.our}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <ResultsTransformations />

      {/* Dermatologist Approved */}
      <section className="bg-white py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">Dermatologist Approved For<br />Your Scalp Safety</h2>
          <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full max-w-[1120px] mb-8">
            <div className="flex flex-col p-8 bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] w-full lg:w-1/2">
              <h3 className="text-[28px] font-bold text-[#121212] leading-[34px] tracking-[-0.16px] mb-5">Wrong adhesives & poor-quality<br />bases can:</h3>
              <div className="flex flex-col gap-5">
                {["Cause itching, redness & <b>infections</b>.", "<b>Damage</b> the scalp with prolonged use."].map((t,i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-[#FF4D4D] rounded-[4px] mt-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-[20px] text-[#121212] leading-[28px] tracking-[-0.1px]" dangerouslySetInnerHTML={{ __html: t }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col p-8 bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] w-full lg:w-1/2">
              <h3 className="text-[28px] font-bold text-[#121212] leading-[34px] tracking-[-0.16px] mb-5">At American Hairline:</h3>
              <div className="flex flex-col gap-5">
                {["Only medical-grade <b>USA adhesives</b> are used.", "Design breathable, <b>antimicrobial bases</b> that are gentle on your scalp."].map((t,i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-[#00C853] rounded-[4px] mt-1">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-[20px] text-[#121212] leading-[28px] tracking-[-0.1px]" dangerouslySetInnerHTML={{ __html: t }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1120px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[16px] p-6 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] flex-shrink-0 flex items-center justify-center"><Lightbulb className="w-12 h-12 text-white" strokeWidth={1.5} /></div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-[32px] font-bold leading-[1.2] tracking-[-0.5px]">Our Design Philosophy:</h3>
                <p className="text-white text-[18px] leading-[24px] tracking-[-0.16px]">Look natural today, protect your scalp for tomorrow.</p>
              </div>
            </div>
            <a href="/contact-us" className="inline-flex items-center gap-2 bg-white rounded-[8px] px-5 py-2.5 hover:bg-opacity-90 transition-opacity whitespace-nowrap">
              <span className="text-[#121212] font-semibold text-[18px] leading-[24px] tracking-[-0.1px]">Talk to an Expert</span>
              <div className="relative w-[22px] h-[24px]"><Image src="/assets/hair-patch-arrow-up-right-black.svg" alt="Arrow" fill className="object-contain" /></div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4 w-full max-w-[608px]">
            {faqItems.map((item, index) => (
              <div key={item.id} className={`bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'pb-6' : 'h-[64px]'}`}>
                <button onClick={() => setActiveAccordion(activeAccordion === index ? null : index)} className="w-full flex items-center justify-between p-6 md:px-[23px] md:py-[19px] text-left">
                  <span className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">{item.question}</span>
                  <Plus className={`w-6 h-6 text-[#121212] transition-transform duration-300 ${activeAccordion === index ? 'rotate-45' : 'rotate-0'}`} />
                </button>
                <div className={`px-6 md:px-[23px] overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[18px] text-[#555555] leading-[25px] tracking-[-0.16px]">{item.answer}</p>
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[16px] p-6 md:px-[23px] md:py-[19px] flex flex-col items-start gap-2 border border-[#12121214]">
              <h3 className="text-[32px] font-bold text-white leading-[42px] tracking-[-0.5px]">Still have questions?</h3>
              <p className="text-[18px] text-white leading-[24px] tracking-[-0.16px] max-w-[560px] mb-4">No worries, we're here to guide you. Talk to us, we will explain everything.</p>
              <a href="/contact-us" className="inline-flex items-center gap-2 bg-white rounded-[8px] px-5 py-2.5 hover:bg-opacity-90 transition-opacity">
                <span className="text-[#121212] font-semibold text-[18px] leading-[24px] tracking-[-0.1px]">Need Guidance</span>
                <div className="relative w-[22px] h-[24px]"><Image src="/assets/hair-patch-arrow-up-right-black.svg" alt="Arrow" fill className="object-contain" /></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ready for Natural Hairline */}
      <section className="bg-white py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex justify-center">
          <div className="w-full max-w-[1120px] bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] p-8 md:p-[60px] flex flex-col items-center text-center">
            <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] mb-5 max-w-[736px]">Ready For The Most<br className="hidden md:block" />Natural Hairline Possible?</h2>
            <p className="text-[18px] text-[#555555] leading-[27px] tracking-[-0.16px] max-w-[736px] mb-[44px]">
              Book your consultation today. We'll assess your scalp, explain your options, and help you choose the safest and most <span className="font-bold text-[#121212]">natural-looking</span><br className="hidden md:block" />solution with our Stick-On.
            </p>
            <a href="/contact-us" className="flex items-center justify-center gap-2 w-full md:w-auto px-8 h-[56px] rounded-[12px] bg-[#1769FF] shadow-[0px_4px_8px_0px_#00000026] hover:bg-[#145ADD] transition-colors mb-4">
              <span className="text-white text-[18px] font-semibold leading-[25px] tracking-[0.2px]">Discuss With A Consultant</span>
              <div className="relative w-6 h-6 bg-white rounded-[6px] flex items-center justify-center"><ArrowUpRight className="w-4 h-4 text-[#1769FF]" /></div>
            </a>
            <p className="text-[#555555] text-[14px] leading-[20px] tracking-[-0.1px]">Limited Stick-On slots every month. Reserve yours today.</p>
          </div>
        </div>
      </section>

      {/* Learn How Clip-On Works */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center">
          <h2 className="mb-[36px] w-full max-w-[1120px] text-left text-[32px] font-extrabold leading-[1.2] tracking-[-0.5px] text-[#121212] md:mb-[44px] md:text-[44px]">Learn How The Clip-On Hair<br />System Works</h2>
          <div className="relative h-[583px] w-full max-w-[358px] overflow-hidden rounded-[16px] bg-gradient-to-br from-[#4686FE] to-[#1769FF] shadow-[0px_8px_24px_0px_#0000000D] md:max-w-[1120px]">
            <div className="relative z-10 flex h-full flex-col md:flex-row">
              <div className="relative z-20 flex h-full w-full flex-col items-start px-[24px] pt-[28px] md:w-[52%] md:justify-center md:pl-[80px] md:pt-0">
                <div className="mb-[16px] flex h-[32px] items-center gap-[6px] rounded-[8px] border border-white bg-white px-[8px] py-[4px] backdrop-blur-[5px] md:h-auto md:px-[8px] md:py-[8px]">
                  <div className="h-5 w-5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <g clipPath="url(#stick-learn-clip-icon-clip)">
                        <path d="M10.6862 1.81436C10.469 1.71532 10.2332 1.66406 9.99452 1.66406C9.75586 1.66406 9.51999 1.71532 9.30285 1.81436L2.16118 5.06436C2.01331 5.12956 1.88758 5.23636 1.79932 5.37174C1.71106 5.50712 1.66406 5.66525 1.66406 5.82686C1.66406 5.98847 1.71106 6.1466 1.79932 6.28198C1.88758 6.41736 2.01331 6.52416 2.16118 6.58936L9.31118 9.84769C9.52832 9.94674 9.76419 9.99799 10.0029 9.99799C10.2415 9.99799 10.4774 9.94674 10.6945 9.84769L17.8445 6.59769C17.9924 6.53249 18.1181 6.42569 18.2064 6.29031C18.2946 6.15493 18.3416 5.99681 18.3416 5.83519C18.3416 5.67358 18.2946 5.51545 18.2064 5.38007C18.1181 5.24469 17.9924 5.1379 17.8445 5.07269L10.6862 1.81436Z" stroke="url(#stick-learn-clip-icon-gradient-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.66407 10C1.66367 10.1594 1.70899 10.3155 1.79466 10.45C1.88033 10.5844 2.00275 10.6914 2.1474 10.7583L9.31406 14.0167C9.53007 14.1145 9.76445 14.1651 10.0016 14.1651C10.2387 14.1651 10.4731 14.1145 10.6891 14.0167L17.8391 10.7667C17.9866 10.7004 18.1116 10.5926 18.1989 10.4564C18.2862 10.3203 18.332 10.1617 18.3307 10" stroke="url(#stick-learn-clip-icon-gradient-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.66407 14.1641C1.66367 14.3235 1.70899 14.4796 1.79466 14.614C1.88033 14.7484 2.00275 14.8555 2.1474 14.9224L9.31406 18.1807C9.53007 18.2785 9.76445 18.3291 10.0016 18.3291C10.2387 18.3291 10.4731 18.2785 10.6891 18.1807L17.8391 14.9307C17.9866 14.8644 18.1116 14.7566 18.1989 14.6205C18.2862 14.4844 18.332 14.3258 18.3307 14.1641" stroke="url(#stick-learn-clip-icon-gradient-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <linearGradient id="stick-learn-clip-icon-gradient-1" x1="10.0029" y1="-0.766667" x2="10.0029" y2="11.387" gradientUnits="userSpaceOnUse"><stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/></linearGradient>
                        <linearGradient id="stick-learn-clip-icon-gradient-2" x1="9.99741" y1="8.78519" x2="9.99741" y2="14.8592" gradientUnits="userSpaceOnUse"><stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/></linearGradient>
                        <linearGradient id="stick-learn-clip-icon-gradient-3" x1="9.99741" y1="12.9493" x2="9.99741" y2="19.0233" gradientUnits="userSpaceOnUse"><stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/></linearGradient>
                        <clipPath id="stick-learn-clip-icon-clip"><rect width="20" height="20" fill="white"/></clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-[#4686FE] to-[#1769FF] bg-clip-text text-[14px] font-semibold leading-[18px] tracking-[-0.1px] text-transparent md:text-[20px] md:leading-[20px]">Clip-on Hair System</span>
                </div>
                <p className="mb-[14px] max-w-[300px] text-[20px] font-semibold leading-[24px] tracking-[-0.1px] text-white md:mb-[18px] md:max-w-[488px] md:text-[30px] md:leading-[36px]">No shaving, no glue, just clip, wear, and go. Perfect for easy volume without commitment.</p>
                <a href="/clip-on-or-stick-on/clip-on-hair-system" className="flex items-center gap-2 text-white text-[14px] font-semibold leading-[18px] tracking-[-0.224px] transition-opacity hover:opacity-80 md:text-[20px] md:leading-normal">
                  Know more
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
              <div className="absolute bottom-0 left-1/2 h-[414px] w-[444px] -translate-x-1/2 md:left-auto md:right-0 md:h-[582px] md:w-[624px] md:translate-x-0">
                <Image
                  src={STICK_ON_LEARN_CLIP_ON_ASSETS.desktop.src}
                  alt={STICK_ON_LEARN_CLIP_ON_ASSETS.desktop.alt}
                  fill
                  className="hidden object-contain object-bottom md:block"
                  sizes="624px"
                />
                <Image
                  src={STICK_ON_LEARN_CLIP_ON_ASSETS.mobile.src}
                  alt={STICK_ON_LEARN_CLIP_ON_ASSETS.mobile.alt}
                  fill
                  className="object-contain object-bottom md:hidden"
                  sizes="444px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      {/* Free E-Book */}
      <Ebook imageSrc="/assets/stick-on-ebook-cover.png" />

      {/* ── Zycon Popup ─────────────────────────────────────────────────── */}
      {zyconOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setZyconOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,20,60,0.60)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          {/* ── DESKTOP modal — flexible, fills viewport minus padding ── */}
          <div className="hidden md:flex"
            style={{
              background: '#F2F3F5',
              borderRadius: 20,
              width: 'min(1100px, calc(100vw - 64px))',
              height: 'min(620px, calc(100vh - 80px))',
              overflow: 'hidden',
              position: 'relative',
              flexDirection: 'row',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setZyconOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 40, height: 40, borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Left: text — 40% width, centred vertically */}
            <div style={{
              width: '40%', minWidth: 320, flexShrink: 0,
              padding: '64px 56px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20,
            }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.25, letterSpacing: '-0.4px' }}>
                Premium Stick-On With Medicated Hygiene –{' '}
                <span style={{ color: '#E052A0' }}>Zycon Range • Pro Series</span>
              </h2>
              <p style={{ fontSize: 15, color: '#444', lineHeight: 1.7, margin: 0 }}>
                The Zycon range is a stick-on hair system that supports scalp health by using <b style={{ color: '#121212' }}>antibacterial protection</b> and <b style={{ color: '#121212' }}>controlling odor</b>. It is designed to help you stay comfortable, confident, and unrestricted in your <b style={{ color: '#121212' }}>active lifestyle</b>.
              </p>
              <a href="/contact-us" style={{ color: '#1769FF', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Know more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>

            {/* Right: image fills remaining width and full height */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Image
                src={STICK_ON_ZYCON_ASSETS.popup.desktop.src}
                alt={STICK_ON_ZYCON_ASSETS.popup.desktop.alt}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                sizes="770px"
              />
            </div>
          </div>

          {/* ── MOBILE modal — full screen, text top + image fills bottom ── */}
          <div className="flex md:hidden"
            style={{
              background: '#fff',
              borderRadius: 20,
              width: 'calc(100vw - 32px)',
              height: 'calc(100vh - 48px)',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Close — top right */}
            <button
              onClick={() => setZyconOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36, borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Text — top section */}
            <div style={{ padding: '32px 24px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 60 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                Premium Stick-On with medicated hygiene –{' '}
                <span style={{ color: '#E052A0' }}>Zycon Range • Pro Series</span>
              </h2>
              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.65, margin: 0 }}>
                The Zycon range is a stick-on hair system that supports scalp health by using <b style={{ color: '#121212' }}>antibacterial protection</b> and <b style={{ color: '#121212' }}>controlling odor</b>. It is designed to help you stay comfortable, confident, and unrestricted in your <b style={{ color: '#121212' }}>active lifestyle</b>.
              </p>
              <a href="/contact-us" style={{ color: '#1769FF', fontSize: 18, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Know more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>

            {/* Image — fills all remaining space */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Image
                src={STICK_ON_ZYCON_ASSETS.popup.mobile.src}
                alt={STICK_ON_ZYCON_ASSETS.popup.mobile.alt}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                sizes="508px"
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
