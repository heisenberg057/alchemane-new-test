'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const stories = [
  {
    id: 1,
    before: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-before.png",
    after: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png",
    name: "Sameer, 38",
    quote: "As a fitness trainer, Sameer needed a hairline that kept up with his active routine, now he's confident in and out of the gym.",
    processDesc: "We built a breathable stick-on system with natural density and a secure base, so he can train and meet clients freely.",
    quoteDesc: "\"I can work out, shower, and still look fresh. My clients never suspected.\""
  },
  {
    id: 2,
    before: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-generic-before.png",
    after: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png",
    name: "Amit, 42",
    quote: "Working in sales meant meeting people daily. I needed a look that was professional yet age-appropriate.",
    processDesc: "Designed a custom hair system with graduated density to match his age profile perfectly.",
    quoteDesc: "\"It's taken 10 years off my face. My confidence in meetings has skyrocketed.\""
  },
  {
    id: 3,
    before: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-generic-before.png",
    after: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-rahul-after.png",
    name: "Rahul, 29",
    quote: "I started losing hair early and it affected my dating life. I just wanted to feel young again.",
    processDesc: "Created a youthful, high-density style that allows for trendy haircuts and styling.",
    quoteDesc: "\"I'm finally dating again without worrying about my hair. Best decision ever.\""
  }
];

function ArrowButton({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right'; onClick: () => void; disabled: boolean; gradientId: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 44, height: 44, border: 'none', padding: 0, flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', transition: 'opacity 0.2s', opacity: disabled ? 0.4 : 1,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"
        style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}>
        <defs>
          <linearGradient id={gradientId} x1="2.37441" y1="-9.87725" x2="53.97" y2="2.52594" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" /><stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r="22" fill={disabled ? '#E8EAED' : `url(#${gradientId})`} />
        <path d="M18 14L26 22L18 30" stroke={disabled ? '#9CA3AF' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export const ResultsStories = () => {
  // ── Desktop state ──
  const [desktopIndex, setDesktopIndex] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const getDesktopStep = () => {
    const container = desktopScrollRef.current;
    if (!container) return 0;
    const firstCard = container.querySelector<HTMLElement>('[data-card]');
    if (!firstCard) return 0;
    const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;
    return firstCard.offsetWidth + gap;
  };

  useEffect(() => {
    const container = desktopScrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const step = getDesktopStep();
      if (!step) return;
      const index = Math.round(container.scrollLeft / step);
      setDesktopIndex(Math.min(Math.max(index, 0), DESKTOP_MAX));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const DESKTOP_MAX = 1; // only 1 scroll allowed in each direction

  const desktopScrollTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), DESKTOP_MAX);
    setDesktopIndex(clamped);
    if (desktopScrollRef.current) {
      const step = getDesktopStep();
      desktopScrollRef.current.scrollTo({ left: clamped * step, behavior: 'smooth' });
    }
  };

  // ── Mobile state ──
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: mobileScrollTo,
  } = useSnapCarousel({
    itemSelector: '[data-mobile-card]',
    itemCount: stories.length,
  });

  // Dots pill shared style
  const dotsPill = {
    width: '152px', height: '44px', borderRadius: '24px',
    background: 'rgba(232, 234, 237, 0.72)',
    backdropFilter: 'blur(3.5px)',
    WebkitBackdropFilter: 'blur(3.5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', flexShrink: 0,
  } as React.CSSProperties;

  const dot = (active: boolean) => ({
    width: active ? '32px' : '8px',
    height: '8px', borderRadius: '10px', border: 'none',
    padding: 0, cursor: 'pointer', flexShrink: 0,
    background: active ? '#121212' : 'rgba(18,18,18,0.30)',
    transition: 'all 300ms ease',
  } as React.CSSProperties);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] lg:pt-[100px] lg:pb-[100px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 lg:px-[80px] xl:px-[160px]">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[32px] md:mb-[48px] lg:mb-[56px]">
          <h2 className="text-[#121212] text-[26px] leading-[31px] md:text-[44px] font-[800] md:leading-[120%] tracking-[-0.5px] capitalize w-full md:w-[640px] mb-[24px] md:mb-0">
            Every Story Shows Hair Restored And Life Changed
          </h2>

        </div>

        {/* ── Desktop Carousel ── */}
        <div className="hidden md:block">
          <div
            ref={desktopScrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <div
                key={story.id}
                data-card=""
                className="w-[340px] xl:w-[380px] h-[640px] rounded-[16px] bg-[#121212] overflow-hidden flex-shrink-0 snap-start text-white flex flex-col hover:-translate-y-1 transition-transform duration-300 ease-out"
              >
                {/* Top Image Section */}
                <div className="h-[200px] flex rounded-t-[16px] overflow-hidden">
                  <div className="w-1/2 relative h-full">
                    <Image src={story.before} alt={`${story.name} Before`} fill className="object-cover object-top" />
                  </div>
                  <div className="w-1/2 relative h-full">
                    <Image src={story.after} alt={`${story.name} After`} fill className="object-cover object-top" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-[24px] flex-1 flex flex-col gap-0 bg-[#121212]">
                  {/* Name Badge */}
                  <div className="inline-flex h-[32px] px-[8px] py-[6px] items-center gap-[6px] rounded-[8px] border border-white bg-[#1769FF] backdrop-blur-[5px] mb-[12px] self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <g clipPath="url(#clip0_desk)">
                        <path d="M13.3333 11.6641C14.4071 11.6641 15.4393 12.0787 16.2148 12.8213C16.9903 13.5639 17.4492 14.5772 17.4958 15.6499L17.5 15.8307V16.6641C17.5001 17.0845 17.3413 17.4895 17.0554 17.7979C16.7695 18.1062 16.3776 18.295 15.9583 18.3266L15.8333 18.3307H4.16667C3.74619 18.3309 3.34119 18.1721 3.03288 17.8861C2.72456 17.6002 2.5357 17.2084 2.50417 16.7891L2.5 16.6641V15.8307C2.50006 14.757 2.91462 13.7248 3.65722 12.9492C4.39982 12.1737 5.41313 11.7148 6.48583 11.6682L6.66667 11.6641H13.3333ZM10 1.66406C11.1051 1.66406 12.1649 2.10305 12.9463 2.88445C13.7277 3.66585 14.1667 4.72566 14.1667 5.83073C14.1667 6.9358 13.7277 7.99561 12.9463 8.77701C12.1649 9.55841 11.1051 9.9974 10 9.9974C8.89493 9.9974 7.83512 9.55841 7.05372 8.77701C6.27232 7.99561 5.83333 6.9358 5.83333 5.83073C5.83333 4.72566 6.27232 3.66585 7.05372 2.88445C7.83512 2.10305 8.89493 1.66406 10 1.66406Z" fill="white"/>
                      </g>
                      <defs><clipPath id="clip0_desk"><rect width="20" height="20" fill="white"/></clipPath></defs>
                    </svg>
                    <span className="text-white text-[15px] font-[700] leading-[120%] tracking-[-0.1px]">{story.name}</span>
                  </div>

                  <p className="text-white text-[15px] font-[600] leading-[130%] tracking-[-0.4px] mb-[16px]">
                    {story.quote}
                  </p>

                  <div className="mt-auto flex flex-col gap-[12px]">
                    {/* Process Card */}
                    <div className="w-full p-[20px_16px] rounded-[12px] border border-[#666] bg-[rgba(18,18,18,0.25)] backdrop-blur-[20px] flex flex-col gap-[8px]">
                      <div className="flex items-center gap-[8px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.7848 0C12.8239 0 13.7167 0.715478 13.9122 1.70497L13.9991 2.14497C14.3408 3.87444 16.1859 4.90724 17.9016 4.32942L18.3383 4.18235C19.3199 3.85177 20.4054 4.2436 20.9249 5.11607L21.7097 6.43388C22.2293 7.30638 22.0365 8.41368 21.2504 9.07255L20.9008 9.36557C19.5267 10.5172 19.5267 12.5828 20.9008 13.7344L21.2504 14.0274C22.0365 14.6863 22.2293 15.7936 21.7097 16.6661L20.925 17.9839C20.4054 18.8564 19.3199 19.2482 18.3382 18.9176L17.9017 18.7705C16.1859 18.1926 14.3408 19.2254 13.9991 20.955L13.9122 21.395C13.7167 22.3845 12.8239 23.1 11.7848 23.1H10.2152C9.1761 23.1 8.28331 22.3845 8.08781 21.3951L8.00082 20.9548C7.65909 19.2254 5.81395 18.1926 4.09822 18.7705L3.66179 18.9175C2.68016 19.2482 1.59465 18.8563 1.07505 17.9838L0.2903 16.6661C-0.229281 15.7936 -0.0365542 14.6863 0.74956 14.0274L1.09922 13.7344C2.47324 12.5827 2.47324 10.5172 1.09922 9.36562L0.74956 9.07256C-0.0365542 8.41368 -0.22928 7.3064 0.2903 6.43392L1.07508 5.1161C1.59466 4.24361 2.68014 3.85178 3.66176 4.18238L4.09831 4.32941C5.81401 4.90724 7.65909 3.87451 8.00082 2.14508L8.0878 1.70489C8.28331 0.715438 9.176 0 10.2152 0H11.7848ZM11 14.85C12.8225 14.85 14.3 13.3725 14.3 11.55C14.3 9.72742 12.8225 8.25 11 8.25C9.1774 8.25 7.69997 9.72742 7.69997 11.55C7.69997 13.3725 9.1774 14.85 11 14.85Z" fill="white"/>
                        </svg>
                        <h4 className="text-white text-[15px] font-[700]">Process & Results:</h4>
                      </div>
                      <p className="text-[rgba(255,255,255,0.80)] text-[13px] font-[400] leading-[20px]">{story.processDesc}</p>
                    </div>

                    {/* Quote Card */}
                    <div className="w-full p-[20px_16px] rounded-[12px] border border-[#666] bg-[rgba(18,18,18,0.25)] backdrop-blur-[20px] flex flex-col gap-[8px]">
                      <div className="flex items-center gap-[8px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <g clipPath="url(#clip0_desk_quote)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.0717 0.98313C5.70415 0.86932 8.29835 0.75 12 0.75C15.7016 0.75 18.2959 0.86932 19.9283 0.98313C21.5612 1.09696 22.8592 2.32933 23.0043 3.97945C23.1289 5.39715 23.25 7.53705 23.25 10.5C23.25 13.4629 23.1289 15.6028 23.0043 17.0205C22.8592 18.6707 21.5612 19.903 19.9283 20.0168C18.362 20.126 15.9104 20.2403 12.4448 20.2494L8.8135 23.3619C8.00265 24.0569 6.75 23.4809 6.75 22.4129V20.1579C5.66845 20.1166 4.77966 20.0662 4.0717 20.0168C2.43883 19.903 1.14074 18.6707 0.9957 17.0205C0.87109 15.6028 0.75 13.4629 0.75 10.5C0.75 7.53705 0.87109 5.39715 0.9957 3.97945C1.14074 2.32933 2.43883 1.09696 4.0717 0.98313ZM17.7343 7.20615C17.7438 7.3577 17.75 7.5379 17.75 7.75C17.75 7.9637 17.7437 8.14475 17.7341 8.29665C17.7013 8.81675 17.2886 9.1607 16.7987 9.18285C16.1157 9.21365 14.7318 9.25 12 9.25C9.2775 9.25 7.89395 9.2153 7.2086 9.1857C6.7151 9.16445 6.29845 8.8179 6.2657 8.29385C6.2562 8.1423 6.25 7.9621 6.25 7.75C6.25 7.5379 6.2562 7.3577 6.2657 7.20615C6.29845 6.6821 6.7151 6.33555 7.2086 6.3143C7.89395 6.2847 9.27755 6.25 12 6.25C14.7225 6.25 16.1061 6.2847 16.7914 6.3143C17.2849 6.33555 17.7016 6.6821 17.7343 7.20615ZM13.7409 12.7324C13.7464 12.8777 13.75 13.0492 13.75 13.25C13.75 13.4529 13.7464 13.6258 13.7408 13.7717C13.7208 14.29 13.3337 14.6699 12.8223 14.6974C12.3258 14.7241 11.467 14.75 10 14.75C8.5413 14.75 7.6842 14.7254 7.18665 14.6999C6.671 14.6734 6.27885 14.2908 6.25905 13.7676C6.25355 13.6223 6.25 13.4508 6.25 13.25C6.25 13.0492 6.25355 12.8777 6.25905 12.7324C6.27885 12.2092 6.671 11.8266 7.18665 11.8001C7.6842 11.7746 8.5413 11.75 10 11.75C11.4587 11.75 12.3158 11.7746 12.8133 11.8001C13.329 11.8266 13.7211 12.2092 13.7409 12.7324Z" fill="white"/>
                          </g>
                          <defs><clipPath id="clip0_desk_quote"><rect width="24" height="24" fill="white"/></clipPath></defs>
                        </svg>
                        <h4 className="text-white text-[15px] font-[700]">His Quote:</h4>
                      </div>
                      <p className="text-[rgba(255,255,255,0.80)] text-[13px] font-[400] leading-[20px]">{story.quoteDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows below carousel, right-aligned */}
          <div className="flex justify-end gap-3 mt-6">
            <ArrowButton direction="left" onClick={() => desktopScrollTo(desktopIndex - 1)} disabled={desktopIndex === 0} gradientId="stories-desk-left" />
            <ArrowButton direction="right" onClick={() => desktopScrollTo(desktopIndex + 1)} disabled={desktopIndex === DESKTOP_MAX} gradientId="stories-desk-right" />
          </div>
        </div>

        {/* ── Mobile Slider ── */}
        <div className="md:hidden">
          <div
            ref={mobileScrollRef}
            className="w-full flex gap-[16px] snap-x snap-mandatory overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <div
                key={story.id}
                data-mobile-card=""
                className="relative w-[358px] h-[488px] rounded-[16px] overflow-hidden flex-shrink-0 snap-center"
              >
                <Image src={story.after} alt={story.name} fill className="object-cover object-[center_top]" />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-[16px] pb-[28px]"
                  style={{ background: 'linear-gradient(180deg, rgba(18, 30, 37, 0.00) 55.08%, #121212 76.87%)' }}
                >
                  <div className="inline-flex items-center self-start bg-[#1769FF] backdrop-blur-[5px] rounded-[8px] px-[8px] py-[6px] mb-[12px] h-[32px] gap-[6px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M13.3333 11.6641C14.4071 11.6641 15.4393 12.0787 16.2148 12.8213C16.9903 13.5639 17.4492 14.5772 17.4958 15.6499L17.5 15.8307V16.6641C17.5001 17.0845 17.3413 17.4895 17.0554 17.7979C16.7695 18.1062 16.3776 18.295 15.9583 18.3266L15.8333 18.3307H4.16667C3.74619 18.3309 3.34119 18.1721 3.03288 17.8861C2.72456 17.6002 2.5357 17.2084 2.50417 16.7891L2.5 16.6641V15.8307C2.50006 14.757 2.91462 13.7248 3.65722 12.9492C4.39982 12.1737 5.41313 11.7148 6.48583 11.6682L6.66667 11.6641H13.3333ZM10 1.66406C11.1051 1.66406 12.1649 2.10305 12.9463 2.88445C13.7277 3.66585 14.1667 4.72566 14.1667 5.83073C14.1667 6.9358 13.7277 7.99561 12.9463 8.77701C12.1649 9.55841 11.1051 9.9974 10 9.9974C8.89493 9.9974 7.83512 9.55841 7.05372 8.77701C6.27232 7.99561 5.83333 6.9358 5.83333 5.83073C5.83333 4.72566 6.27232 3.66585 7.05372 2.88445C7.83512 2.10305 8.89493 1.66406 10 1.66406Z" fill="white"/>
                    </svg>
                    <span className="text-white text-[18px] font-[700] leading-[22px] tracking-[-0.1px]">{story.name}</span>
                  </div>
                  <p className="text-white text-[16px] leading-[24px] tracking-[-0.16px] mb-[12px] max-w-[302px]">
                    <span className="font-medium">{story.quote} </span>
                    <span className="font-[700] underline cursor-pointer">Read More</span>
                  </p>
                </div>
              </div>
            ))}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center justify-center gap-[12px] mt-[40px] w-full">
            <ArrowButton direction="left" onClick={scrollMobilePrev} disabled={!canScrollMobilePrev} gradientId="stories-mob-left" />
            <div style={dotsPill}>
              {stories.map((_, i) => (
                <button key={i} onClick={() => mobileScrollTo(i)} style={dot(i === mobileIndex)} />
              ))}
            </div>
            <ArrowButton direction="right" onClick={scrollMobileNext} disabled={!canScrollMobileNext} gradientId="stories-mob-right" />
          </div>
        </div>

      </div>
    </section>
  );
};
