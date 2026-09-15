'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

// --- Card Data & SVGs ---

function TopExpertsIcon() {
  const iconId = React.useId();
  const gradientPrimaryId = `${iconId}-why-top-experts-primary`;
  const gradientSecondaryId = `${iconId}-why-top-experts-secondary`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M19.0354 8.19055C17.7671 7.49898 16.2344 7.49898 14.9662 8.19055L8.17437 11.894C6.80873 12.6386 5.95898 14.0698 5.95898 15.6253V22.6203C5.95898 24.1758 6.80873 25.607 8.17437 26.3516L14.9662 30.0551C16.2344 30.7466 17.7671 30.7466 19.0354 30.0551L25.8272 26.3516C27.1929 25.607 28.0426 24.1758 28.0426 22.6203V15.6253C28.0426 14.0698 27.1929 12.6386 25.8272 11.894L19.0354 8.19055ZM17.0011 14.8728C16.5986 14.8728 16.3295 15.3556 15.7911 16.3213L15.6519 16.5712C15.499 16.8457 15.4225 16.9828 15.3032 17.0733C15.1839 17.1638 15.0355 17.1976 14.7384 17.2647L14.468 17.3259C13.4225 17.5625 12.8999 17.6806 12.7755 18.0806C12.6511 18.4805 13.0075 18.8971 13.7201 19.7306L13.9045 19.9462C14.107 20.1829 14.2083 20.3013 14.2539 20.4478C14.2994 20.5943 14.2841 20.7523 14.2535 21.0683L14.2256 21.3559C14.1178 22.4678 14.064 23.0237 14.3895 23.271C14.7152 23.518 15.2045 23.2928 16.1833 22.8421L16.4364 22.7255C16.7146 22.5975 16.8536 22.5334 17.0011 22.5334C17.1486 22.5334 17.2875 22.5975 17.5658 22.7255L17.8189 22.8421C18.7977 23.2928 19.287 23.518 19.6127 23.271C19.9383 23.0237 19.8843 22.4678 19.7766 21.3559L19.7487 21.0683C19.7181 20.7523 19.7028 20.5943 19.7483 20.4478C19.7939 20.3013 19.8952 20.1829 20.0976 19.9462L20.2821 19.7306C20.9947 18.8971 21.3511 18.4805 21.2267 18.0806C21.1023 17.6806 20.5796 17.5625 19.5342 17.3259L19.2638 17.2647C18.9667 17.1976 18.8183 17.1638 18.699 17.0733C18.5797 16.9828 18.5032 16.8457 18.3503 16.5712L18.2111 16.3213C17.6727 15.3556 17.4036 14.8728 17.0011 14.8728Z" fill={`url(#${gradientPrimaryId})`} />
      <path d="M15.5768 2.83984H18.4102C21.0814 2.83984 22.4171 2.83984 23.2469 3.66971C24.0768 4.49957 24.0768 5.83522 24.0768 8.50651V8.53197L20.0451 6.33357C18.1427 5.29626 15.8437 5.29624 13.9413 6.33357L9.91016 8.53166V8.50651C9.91016 5.83522 9.91016 4.49957 10.74 3.66971C11.5699 2.83984 12.9055 2.83984 15.5768 2.83984Z" fill={`url(#${gradientSecondaryId})`} />
      <defs>
        <linearGradient id={gradientPrimaryId} x1="7.1507" y1="2.53081" x2="33.1462" y2="8.55667" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <linearGradient id={gradientSecondaryId} x1="10.6746" y1="1.56206" x2="23.6149" y2="9.3041" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TailoredTechnologyIcon() {
  const iconId = React.useId();
  const gradientId = `${iconId}-why-tech-gradient`;
  const clipId = `${iconId}-why-tech-clip`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g clipPath={`url(#${clipId})`}>
        <path d="M11.6875 1.59375C11.6875 0.710547 10.977 0 10.0938 0C9.21055 0 8.5 0.710547 8.5 1.59375V4.25C6.15586 4.25 4.25 6.15586 4.25 8.5H1.59375C0.710547 8.5 0 9.21055 0 10.0938C0 10.977 0.710547 11.6875 1.59375 11.6875H4.25V15.4062H1.59375C0.710547 15.4062 0 16.1168 0 17C0 17.8832 0.710547 18.5938 1.59375 18.5938H4.25V22.3125H1.59375C0.710547 22.3125 0 23.023 0 23.9062C0 24.7895 0.710547 25.5 1.59375 25.5H4.25C4.25 27.8441 6.15586 29.75 8.5 29.75V32.4062C8.5 33.2895 9.21055 34 10.0938 34C10.977 34 11.6875 33.2895 11.6875 32.4062V29.75H15.4062V32.4062C15.4062 33.2895 16.1168 34 17 34C17.8832 34 18.5938 33.2895 18.5938 32.4062V29.75H22.3125V32.4062C22.3125 33.2895 23.023 34 23.9062 34C24.7895 34 25.5 33.2895 25.5 32.4062V29.75C27.8441 29.75 29.75 27.8441 29.75 25.5H32.4062C33.2895 25.5 34 24.7895 34 23.9062C34 23.023 33.2895 22.3125 32.4062 22.3125H29.75V18.5938H32.4062C33.2895 18.5938 34 17.8832 34 17C34 16.1168 33.2895 15.4062 32.4062 15.4062H29.75V11.6875H32.4062C33.2895 11.6875 34 10.977 34 10.0938C34 9.21055 33.2895 8.5 32.4062 8.5H29.75C29.75 6.15586 27.8441 4.25 25.5 4.25V1.59375C25.5 0.710547 24.7895 0 23.9062 0C23.023 0 22.3125 0.710547 22.3125 1.59375V4.25H18.5938V1.59375C18.5938 0.710547 17.8832 0 17 0C16.1168 0 15.4062 0.710547 15.4062 1.59375V4.25H11.6875V1.59375ZM10.625 8.5H23.375C24.5504 8.5 25.5 9.44961 25.5 10.625V23.375C25.5 24.5504 24.5504 25.5 23.375 25.5H10.625C9.44961 25.5 8.5 24.5504 8.5 23.375V10.625C8.5 9.44961 9.44961 8.5 10.625 8.5ZM23.375 10.625H10.625V23.375H23.375V10.625Z" fill={`url(#${gradientId})`} />
      </g>
      <defs>
        <linearGradient id={gradientId} x1="1.83477" y1="-7.63242" x2="41.7041" y2="1.95186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <clipPath id={clipId}><rect width="34" height="34" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

function CelebrityTrustedIcon() {
  const iconId = React.useId();
  const gradientId = `${iconId}-why-celeb-gradient`;
  const clipId = `${iconId}-why-celeb-clip`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g clipPath={`url(#${clipId})`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M24.0689 2.01946C23.7232 2.67041 23.371 3.33366 22.6741 4.03061C21.9771 4.72756 21.3139 5.07975 20.663 5.42543C20.2016 5.67043 19.7465 5.91214 19.2899 6.27099C18.4281 6.94822 18.4281 8.23036 19.2899 8.90759C19.7465 9.26641 20.2017 9.50813 20.663 9.75312C21.314 10.0988 21.9772 10.451 22.6742 11.148C23.3711 11.8449 23.7233 12.5082 24.069 13.1591C24.3141 13.6205 24.5558 14.0756 24.9145 14.5322C25.5918 15.394 26.8738 15.394 27.5512 14.5322C27.9101 14.0756 28.1517 13.6205 28.3968 13.1591C28.7424 12.5082 29.0945 11.8449 29.7915 11.148C30.4885 10.451 31.1518 10.0988 31.8026 9.75312C32.264 9.50813 32.7192 9.26641 33.1757 8.90759C34.0374 8.23036 34.0374 6.94822 33.1757 6.27099C32.7192 5.91214 32.264 5.67045 31.8026 5.42546C31.1518 5.07977 30.4883 4.72756 29.7915 4.03061C29.0945 3.33366 28.7424 2.67041 28.3965 2.01945C28.1515 1.55811 27.9099 1.10294 27.5512 0.646326C26.8738 -0.215442 25.5918 -0.215442 24.9145 0.646326C24.5555 1.10294 24.3139 1.55811 24.0689 2.01946ZM17.4142 11.2945C16.0917 10.2552 15.4954 8.69361 15.6253 7.18333C14.883 7.1429 14.1316 7.1191 13.3733 7.1191C11.1624 7.1191 9.01131 7.32123 6.96947 7.54881C3.53379 7.93177 0.775177 10.6869 0.406702 14.1309C0.189314 16.1628 0 18.2983 0 20.4924C0 22.6864 0.189314 24.822 0.406702 26.8537C0.77518 30.2979 3.53382 33.0529 6.96947 33.4359C9.01131 33.6634 11.1624 33.8657 13.3733 33.8657C15.5841 33.8657 17.7352 33.6634 19.7771 33.4359C23.2127 33.0529 25.9714 30.2979 26.3398 26.8537C26.5571 24.822 26.7466 22.6864 26.7466 20.4924C26.7466 19.7179 26.723 18.9508 26.6829 18.1929C25.159 18.3383 23.577 17.7433 22.5277 16.408C21.9827 15.7145 21.595 14.9783 21.3562 14.5249L21.355 14.5227C21.3151 14.4469 21.2788 14.3779 21.2472 14.3196C21.0036 13.8699 20.8236 13.5905 20.5276 13.2945C20.2316 12.9985 19.9522 12.8185 19.5025 12.5749C19.4434 12.5429 19.3743 12.5065 19.2972 12.4659C18.8438 12.2272 18.1076 11.8394 17.4142 11.2945ZM18.3496 27.0531C19.3566 27.8761 20.1376 28.9306 20.6322 30.1167C20.255 30.2756 19.8521 30.3829 19.4324 30.4298C17.4167 30.6544 15.4016 30.8407 13.3649 30.8407C11.3282 30.8407 9.31311 30.6544 7.29737 30.4298C6.88381 30.3836 6.48647 30.2787 6.11413 30.1235C6.62408 28.9411 7.4114 27.854 8.39157 27.0531C9.79674 25.9044 11.5558 25.2771 13.3706 25.2771C15.1854 25.2771 16.9444 25.9044 18.3496 27.0531ZM13.3732 22.7017C16.1665 22.7017 17.7377 21.1304 17.7377 18.3371C17.7377 15.5438 16.1665 13.9725 13.3732 13.9725C10.5798 13.9725 9.00857 15.5438 9.00857 18.3371C9.00857 21.1304 10.5798 22.7017 13.3732 22.7017Z" fill={`url(#${gradientId})`} />
      </g>
      <defs>
        <linearGradient id={gradientId} x1="1.82517" y1="-7.60228" x2="41.4913" y2="1.92084" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <clipPath id={clipId}><rect width="34" height="34" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

function GenuineGuidanceIcon() {
  const iconId = React.useId();
  const gradientId = `${iconId}-why-guidance-gradient`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="34" viewBox="0 0 35 34" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.3213 3.02062C14.6852 2.65866 15.1172 2.37153 15.5928 2.17563C16.0683 1.97974 16.578 1.87891 17.0928 1.87891C17.6075 1.87891 18.1172 1.97974 18.5928 2.17563C19.0683 2.37153 19.5004 2.65866 19.8643 3.02062L21.6084 4.75603C21.9432 5.08753 22.3964 5.27453 22.868 5.27453H24.9655C26.0048 5.27453 27.0015 5.68499 27.7364 6.4156C28.4713 7.14621 28.8841 8.13713 28.8841 9.17037V11.2543C28.8841 11.7246 29.0708 12.1751 29.4056 12.5066L31.1512 14.242C31.5152 14.6038 31.804 15.0334 32.0011 15.5062C32.1981 15.9789 32.2995 16.4857 32.2995 16.9975C32.2995 17.5092 32.1981 18.016 32.0011 18.4887C31.804 18.9615 31.5152 19.3911 31.1512 19.7529L29.4056 21.4869C29.0708 21.8184 28.8841 22.2689 28.8841 22.7392V24.8245C28.8841 25.8578 28.4713 26.8487 27.7364 27.5793C27.0015 28.3099 26.0048 28.7204 24.9655 28.7204H22.868C22.3964 28.7204 21.9418 28.906 21.6084 29.2389L19.8628 30.9743C19.128 31.7049 18.1313 32.1153 17.0921 32.1153C16.0528 32.1153 15.0561 31.7049 14.3213 30.9743L12.5757 29.2374C12.2423 28.906 11.7892 28.719 11.3161 28.719H9.22002C8.18075 28.719 7.18404 28.3099 6.44917 27.5793C5.7143 26.8487 5.30145 25.8578 5.30145 24.8245V22.7392C5.30145 22.2689 5.11336 21.8184 4.77992 21.4869L3.03438 19.75C2.29954 19.0194 1.88672 18.0285 1.88672 16.9953C1.88672 15.9621 2.29954 14.9712 3.03438 14.2406L4.77992 12.5066C5.11336 12.1751 5.30145 11.7246 5.30145 11.2543V9.17037C5.30145 8.13713 5.7143 7.14621 6.44917 6.4156C7.18404 5.68499 8.18075 5.27453 9.22002 5.27453H11.3161C11.7892 5.27453 12.2423 5.08753 12.5757 4.75603L14.3213 3.02062ZM21.9874 13.9771C22.2178 13.669 22.2956 13.2805 22.1826 13.1727C22.1594 13.0325 22.1081 12.8983 22.0317 12.7781C21.8556 12.658 21.7382 12.4731 21.3484 12.3057C21.0642 12.2753 20.9238 12.3025 20.5315 12.4639C20.4129 12.5432 20.3115 12.6454 20.2333 12.7645L15.3501 19.7472L13.0688 17.7483C12.856 17.5619 12.5775 17.4672 12.2945 17.485C12.0115 17.5028 11.7472 17.6317 11.5598 17.8432C11.3723 18.0547 11.2771 18.3316 11.295 18.613C11.3129 18.8943 11.4425 19.1571 11.6552 19.3435L14.8371 22.1286C14.9501 22.2275 15.0828 22.3016 15.2266 22.346C15.3704 22.3904 15.5219 22.404 15.6714 22.3861C15.8209 22.3682 15.9648 22.3191 16.0939 22.242C16.2229 22.1649 16.3341 22.0616 16.4202 21.9388L21.9874 13.9771Z" fill={`url(#${gradientId})`} />
      <defs>
        <linearGradient id={gradientId} x1="3.52791" y1="-4.90865" x2="39.168" y2="3.70896" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const CARD_DATA = [
  {
    id: 1,
    heading: "India’s #1 Top Experts",
    body: (
      <>
        Trusted by thousands and featured in national media, we specialize in <b>non-surgical hair systems</b> tailored to Indian men — blending perfectly with your face shape, hair texture, and lifestyle. Our systems use <b>100% human hair</b> and are <b>ISO certified</b> for safety and quality.
      </>
    ),
    icon: <TopExpertsIcon />
  },
  {
    id: 2,
    heading: "Tailored with Technology",
    body: (
      <>
        From <b>Invisible Hairline Sculpting™</b> to <b>Nano Fusion Technology</b>, every system is crafted with advanced design and precision engineering for a seamless, natural look. Our <b>Single-strand Implantation</b> technique customizes your hairline with unmatched detail.
      </>
    ),
    icon: <TailoredTechnologyIcon />
  },
  {
    id: 3,
    heading: "Celebrity-Trusted",
    body: (
      <>
        Our systems are trusted by <b>Bollywood actors</b> and public figures, designed for high-definition cameras — yet discreet in daily life. Lightweight, breathable, and <b>virtually invisible</b> even up close. <b>USA-manufactured</b> and <b>doctor approved</b>.
      </>
    ),
    icon: <CelebrityTrustedIcon />
  },
  {
    id: 4,
    heading: "Genuine Guidance",
    body: (
      <>
        No pressure, no pushy sales — just honest advice from our certified specialists. We guide you toward <b>durability</b>, comfort, and <b>natural looking results</b> as our priority. We restore confidence and ensure results are <b>undetectable</b>.
      </>
    ),
    icon: <GenuineGuidanceIcon />
  }
];

export const WhyChooseUs = () => {
  const [desktopIndex, setDesktopIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-why-choose-mobile-card]',
    itemCount: CARD_DATA.length,
  });
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef<number>(0);

  // Constants
  const [cardWidth, setCardWidth] = useState(370);
  const GAP = 24;
  const ITEM_WIDTH = cardWidth + GAP;
  const DRAG_THRESHOLD = 80;
  const [desktopMaxIndex, setDesktopMaxIndex] = useState(Math.max(0, CARD_DATA.length - 1));

  useEffect(() => {
    const updateWidth = () => {
      // On mobile (<768), card width is 85vw or full width minus padding
      // Let's say we want a peek, so 85vw
      if (window.innerWidth < 768) {
        setCardWidth(window.innerWidth * 0.85);
      } else {
        setCardWidth(370);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const updateDesktopBounds = () => {
      if (window.innerWidth < 768) {
        setDesktopMaxIndex(Math.max(0, CARD_DATA.length - 1));
        return;
      }

      const viewport = desktopViewportRef.current;
      if (!viewport) {
        setDesktopMaxIndex(Math.max(0, CARD_DATA.length - 1));
        return;
      }

      const viewportWidth = viewport.clientWidth;
      const trackWidth = CARD_DATA.length * cardWidth + (CARD_DATA.length - 1) * GAP;
      const maxScrollable = Math.max(0, trackWidth - viewportWidth);
      const maxStepIndex = Math.ceil(maxScrollable / ITEM_WIDTH);
      setDesktopMaxIndex(Math.max(0, maxStepIndex));
      setDesktopIndex((prev) => Math.min(prev, Math.max(0, maxStepIndex)));
    };

    updateDesktopBounds();
    window.addEventListener('resize', updateDesktopBounds);

    return () => window.removeEventListener('resize', updateDesktopBounds);
  }, [ITEM_WIDTH, cardWidth]);

  // Responsive peek calculation
  // On desktop: 3 full cards + peek. 
  // Container width is fluid.
  
  const updatePosition = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
  }, []);

  const setSliderPosition = useCallback(() => {
    // Basic snap to index
    if (window.innerWidth >= 768) {
      const viewport = desktopViewportRef.current;
      const viewportWidth = viewport?.clientWidth ?? 0;
      const trackWidth = CARD_DATA.length * cardWidth + (CARD_DATA.length - 1) * GAP;
      const maxScrollable = Math.max(0, trackWidth - viewportWidth);
      currentTranslate.current = -Math.min(desktopIndex * ITEM_WIDTH, maxScrollable);
    } else {
      currentTranslate.current = 0;
    }
    prevTranslate.current = currentTranslate.current;
    updatePosition();
  }, [ITEM_WIDTH, cardWidth, desktopIndex, updatePosition]);

  useEffect(() => {
    setSliderPosition();
  }, [setSliderPosition]);

  // Touch/Mouse Events
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    
    // Stop any transition for direct control
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
    
    // Capture pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    currentTranslate.current = prevTranslate.current + diff;
    updatePosition();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    const movedBy = currentTranslate.current - prevTranslate.current;

    // Restore transition
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    if (movedBy < -DRAG_THRESHOLD && desktopIndex < desktopMaxIndex) {
      setDesktopIndex((prev) => prev + 1);
    } else if (movedBy > DRAG_THRESHOLD && desktopIndex > 0) {
      setDesktopIndex((prev) => prev - 1);
    } else {
      // Snap back
      setSliderPosition();
    }
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const nextSlide = () => {
    if (desktopIndex < desktopMaxIndex) {
      setDesktopIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (desktopIndex > 0) {
      setDesktopIndex((prev) => prev - 1);
    }
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="w-full bg-[#F5F5F5] py-[60px] md:py-[80px] lg:py-[120px] overflow-hidden">
      {/* Heading */}
      <h2 className="w-full max-w-[90vw] lg:max-w-[631px] mx-auto mb-[32px] lg:mb-[48px] text-center text-[#121212] font-extrabold text-[28px] md:text-[36px] lg:text-[44px] leading-tight lg:leading-[53px] tracking-[-0.5px] capitalize font-sans px-[20px]">
        Why Thousands Of Men Choose American Hairline
      </h2>

      {/* Outer Container */}
      <div ref={desktopViewportRef} className="relative hidden w-full overflow-hidden md:block">
        {/* Cards Track */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-[24px] pl-[20px] md:pl-[60px] lg:pl-[160px] will-change-transform"
          style={{ 
            transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {CARD_DATA.map((card) => (
            <div
              key={card.id}
              className="flex flex-col justify-start items-start gap-[20px] p-[24px] lg:p-[32px] bg-white rounded-[16px] border border-[rgba(0,0,0,0.06)] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] select-none shrink-0"
              style={{ width: cardWidth, minWidth: cardWidth }}
            >
              {/* Icon Badge */}
              <div className="flex justify-center items-center w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-[12px] bg-[rgba(23,105,255,0.10)] mb-[4px]">
                {/* Scale icon slightly on mobile if needed, but current SVG size is fine */}
                {card.icon}
              </div>

              {/* Card Heading */}
              <h3 className="self-stretch text-[#121212] font-bold text-[20px] lg:text-[26px] leading-[130%] tracking-[-0.5px] font-sans mt-[4px]">
                {card.heading}
              </h3>

              {/* Card Body */}
              <p className="text-[#555555] font-normal text-[16px] lg:text-[18px] leading-[160%] tracking-[-0.16px] font-sans">
                {card.body}
              </p>
            </div>
          ))}
          
          {/* Spacer to allow scrolling last item into view comfortably on mobile only */}
          <div className="min-w-[20px] md:min-w-0 lg:min-w-0" />
        </div>
      </div>

      <div className="relative w-full overflow-hidden md:hidden">
        <div
          ref={mobileScrollRef}
          className="flex items-stretch gap-[24px] overflow-x-auto px-[20px] pb-2 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
        >
          {CARD_DATA.map((card) => (
            <div
              key={card.id}
              data-why-choose-mobile-card=""
              className="flex flex-col justify-start items-start gap-[20px] p-[24px] bg-white rounded-[16px] border border-[rgba(0,0,0,0.06)] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] shrink-0 snap-start"
              style={{ width: cardWidth, minWidth: cardWidth }}
            >
              <div className="flex justify-center items-center w-[44px] h-[44px] rounded-[12px] bg-[rgba(23,105,255,0.10)] mb-[4px]">
                {card.icon}
              </div>
              <h3 className="self-stretch text-[#121212] font-bold text-[20px] leading-[130%] tracking-[-0.5px] font-sans mt-[4px]">
                {card.heading}
              </h3>
              <p className="text-[#555555] font-normal text-[16px] leading-[160%] tracking-[-0.16px] font-sans">
                {card.body}
              </p>
            </div>
          ))}
          <div className="min-w-[20px] shrink-0" />
        </div>
      </div>

      {/* Mobile Navigation Controls */}
      <div className="mt-[24px] flex items-center justify-center gap-[16px] px-[16px] md:hidden">
        <button
          onClick={scrollMobilePrev}
          disabled={!canScrollMobilePrev}
          aria-label="Previous slide"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full aspect-square"
        >
          {!canScrollMobilePrev ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle opacity="0.7" cx="28" cy="28" r="28" transform="matrix(-1 0 0 1 56 0)" fill="#E8EAED"/>
              <g transform="translate(12, 12)">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M21.334 24L13.334 16L21.334 8" stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                </svg>
              </g>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="url(#why_choose_mobile_prev)"/>
              <g transform="translate(12, 12)">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M21.334 24L13.334 16L21.334 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </g>
              <defs>
                <linearGradient id="why_choose_mobile_prev" x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4686FE"/>
                  <stop offset="1" stopColor="#1769FF"/>
                </linearGradient>
              </defs>
            </svg>
          )}
        </button>

        <div
          className="flex min-w-[152px] flex-shrink-0 items-center justify-center gap-[8px]"
          style={{
            width: '152px',
            height: '44px',
            borderRadius: '24px',
            background: 'rgba(232, 234, 237, 0.72)',
            backdropFilter: 'blur(3.5px)',
            WebkitBackdropFilter: 'blur(3.5px)',
          }}
        >
          {CARD_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollMobileTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === mobileIndex ? '32px' : '8px',
                height: '8px',
                borderRadius: '10px',
                background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                transition: 'all 300ms ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={scrollMobileNext}
          disabled={!canScrollMobileNext}
          aria-label="Next slide"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full aspect-square"
        >
          {!canScrollMobileNext ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle opacity="0.7" cx="28" cy="28" r="28" transform="matrix(-1 0 0 1 56 0)" fill="#E8EAED"/>
              <g transform="translate(12, 12)">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M13.334 24L21.334 16L13.334 8" stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                </svg>
              </g>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="url(#why_choose_mobile_next)"/>
              <g transform="translate(12, 12)">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M13.334 24L21.334 16L13.334 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </g>
              <defs>
                <linearGradient id="why_choose_mobile_next" x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4686FE"/>
                  <stop offset="1" stopColor="#1769FF"/>
                </linearGradient>
              </defs>
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Navigation Controls */}
      <div className="mt-[32px] hidden md:block">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] lg:px-[160px]">
          <div className="flex justify-end gap-[12px]">
            <button
              onClick={prevSlide}
              disabled={desktopIndex === 0}
              aria-label="Previous slide"
              className={`flex items-center justify-center w-[56px] h-[56px] rounded-full transition-all duration-200 ease-in-out aspect-square
                ${desktopIndex === 0 
                  ? 'bg-[#E8EAED] opacity-70 cursor-not-allowed' 
                  : 'bg-white bg-gradient-to-r from-[#4686FE] to-[#1769FF] shadow-md hover:scale-105'
                }`}
            >
              {desktopIndex === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle opacity="0.7" cx="28" cy="28" r="28" transform="matrix(-1 0 0 1 56 0)" fill="#E8EAED"/>
                  <g transform="translate(12, 12)">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                       <path d="M21.334 24L13.334 16L21.334 8" stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                     </svg>
                  </g>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="28" fill="url(#paint0_linear_1542_3834_prev)"/>
                  <g transform="translate(12, 12)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M21.334 24L13.334 16L21.334 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_1542_3834_prev" x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/>
                      <stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </button>

            <button
              onClick={nextSlide}
              disabled={desktopIndex >= desktopMaxIndex}
              aria-label="Next slide"
              className={`flex items-center justify-center w-[56px] h-[56px] rounded-full transition-all duration-200 ease-in-out aspect-square
                ${desktopIndex >= desktopMaxIndex 
                  ? 'bg-[#E8EAED] opacity-70 cursor-not-allowed' 
                  : 'bg-white bg-gradient-to-r from-[#4686FE] to-[#1769FF] shadow-md hover:scale-105'
                }`}
            >
              {desktopIndex >= desktopMaxIndex ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle opacity="0.7" cx="28" cy="28" r="28" transform="matrix(-1 0 0 1 56 0)" fill="#E8EAED"/>
                  <g transform="translate(12, 12)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M13.334 24L21.334 16L13.334 8" stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                    </svg>
                  </g>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="28" fill="url(#paint0_linear_1542_3834_next)"/>
                  <g transform="translate(12, 12)">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                       <path d="M13.334 24L21.334 16L13.334 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_1542_3834_next" x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/>
                      <stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
