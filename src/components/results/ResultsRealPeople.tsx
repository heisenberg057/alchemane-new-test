"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RESULTS_REAL_PEOPLE_FILTER_LABELS,
  RESULTS_REAL_PEOPLE_FILTER_ORDER,
  RESULTS_REAL_PEOPLE_FILTERS,
  type ResultsRealPeopleFilterKey,
  type ResultsRealPeopleItem,
  type ResultsRealPeopleVariant,
} from "./resultsRealPeopleAssets";
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

function getVariantLabel(variant: ResultsRealPeopleVariant) {
  return variant === "stick-on" ? "Stick-On Hair System" : "Clip On Hair System";
}

function getVariantHref(variant: ResultsRealPeopleVariant) {
  return variant === "stick-on"
    ? "/clip-on-or-stick-on/stick-on-hair-system"
    : "/clip-on-or-stick-on/clip-on-hair-system";
}

function ArrowButton({
  direction,
  onClick,
  disabled,
  gradientId,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  gradientId: string;
}) {
  const arrowPath =
    direction === "left" ? "M18.666 24L10.666 16L18.666 8" : "M13.334 24L21.334 16L13.334 8";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous result" : "Next result"}
      style={{
        width: 56,
        height: 56,
        border: "none",
        padding: 0,
        flexShrink: 0,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
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
            stroke={disabled ? "rgba(18,18,18,0.4)" : "white"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </svg>
    </button>
  );
}

function VariantCTA({
  variant,
  mobile = false,
}: {
  variant: ResultsRealPeopleVariant;
  mobile?: boolean;
}) {
  return (
    <a
      href={getVariantHref(variant)}
      style={{
        display: "inline-flex",
        height: mobile ? 28 : 40,
        padding: mobile ? "4px 4px 4px 10px" : "4px 6px 4px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: mobile ? 6 : 8,
        borderRadius: 8,
        background: "linear-gradient(104deg, #4686FE 0%, #1769FF 100%)",
        color: "#FFF",
        fontSize: mobile ? 12 : 18,
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: mobile ? "16px" : "140%",
        letterSpacing: mobile ? "0.05px" : "0.15px",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span>{getVariantLabel(variant)}</span>
      {mobile ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M14 0H6C2.68629 0 0 2.68629 0 6V14C0 17.3137 2.68629 20 6 20H14C17.3137 20 20 17.3137 20 14V6C20 2.68629 17.3137 0 14 0Z" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 7.125C8 6.77982 8.27982 6.5 8.625 6.5H12.875C13.2202 6.5 13.5 6.77982 13.5 7.125V11.375C13.5 11.7202 13.2202 12 12.875 12C12.5298 12 12.25 11.7202 12.25 11.375V8.63388L7.56694 13.317C7.32287 13.561 6.92713 13.561 6.68306 13.317C6.43898 13.0729 6.43898 12.6772 6.68306 12.4331L11.3661 7.75H8.625C8.27982 7.75 8 7.47018 8 7.125Z"
            fill="url(#results-real-people-cta-arrow-mobile)"
          />
          <defs>
            <linearGradient
              id="results-real-people-cta-arrow-mobile"
              x1="6.87775"
              y1="4.92863"
              x2="15.0861"
              y2="6.90187"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4686FE" />
              <stop offset="1" stopColor="#1769FF" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
          <path d="M14 0.335938H6C2.68629 0.335938 0 3.02223 0 6.33594V14.3359C0 17.6496 2.68629 20.3359 6 20.3359H14C17.3137 20.3359 20 17.6496 20 14.3359V6.33594C20 3.02223 17.3137 0.335938 14 0.335938Z" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 7.46094C8 7.11576 8.27982 6.83594 8.625 6.83594H12.875C13.2202 6.83594 13.5 7.11576 13.5 7.46094V11.7109C13.5 12.0561 13.2202 12.3359 12.875 12.3359C12.5298 12.3359 12.25 12.0561 12.25 11.7109V8.96982L7.56694 13.6529C7.32287 13.8969 6.92713 13.8969 6.68306 13.6529C6.43898 13.4088 6.43898 13.0131 6.68306 12.769L11.3661 8.08594H8.625C8.27982 8.08594 8 7.80612 8 7.46094Z"
            fill="url(#results-real-people-cta-arrow-desktop)"
          />
          <defs>
            <linearGradient
              id="results-real-people-cta-arrow-desktop"
              x1="6.87775"
              y1="5.26457"
              x2="15.0861"
              y2="7.23781"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4686FE" />
              <stop offset="1" stopColor="#1769FF" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </a>
  );
}

function getResultsForFilter(filter: ResultsRealPeopleFilterKey): ResultsRealPeopleItem[] {
  if (filter === "all") {
    return RESULTS_REAL_PEOPLE_FILTER_ORDER.flatMap((key) =>
      key === "all" ? [] : RESULTS_REAL_PEOPLE_FILTERS[key].items,
    );
  }

  return RESULTS_REAL_PEOPLE_FILTERS[filter].items;
}

function getVisibleMobileDotIndexes(total: number, active: number, maxVisible = 5) {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(0, active - half);
  let end = start + maxVisible - 1;

  if (end >= total) {
    end = total - 1;
    start = end - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export const ResultsRealPeople = () => {
  const [activeFilter, setActiveFilter] = useState<ResultsRealPeopleFilterKey>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const filteredItems = getResultsForFilter(activeFilter);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canMobilePrev,
    canNext: canMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-results-real-people-mobile-card]',
    itemCount: filteredItems.length,
  });
  const visibleMobileDots = getVisibleMobileDotIndexes(filteredItems.length, mobileIndex);

  useEffect(() => {
    setActiveIndex(0);
    desktopScrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
    mobileScrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeFilter]);

  useEffect(() => {
    const updatePill = () => {
      const activeIndex = RESULTS_REAL_PEOPLE_FILTER_ORDER.indexOf(activeFilter);
      const activeButton = filterRefs.current[activeIndex];
      const container = filterContainerRef.current;

      if (!activeButton || !container) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setPillStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeFilter]);

  const scrollDesktopTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), filteredItems.length - 1);
    setActiveIndex(clamped);
    desktopCardRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="relative flex w-full justify-center overflow-hidden bg-[#F5F6F7] py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="max-w-[400px] text-[26px] font-extrabold leading-[31px] tracking-[-0.5px] text-[#121212] md:mb-16 md:max-w-[850px] md:text-[48px] md:leading-[1.2]">
          See Real Men, Real Transformations Up Close
        </h2>

        <div className="mb-11 mt-6 w-full overflow-x-auto hide-scrollbar md:mt-0">
          <div
            ref={filterContainerRef}
            className="relative flex h-14 w-max items-center rounded-full bg-white px-3 shadow-sm"
          >
            <div
              className="absolute top-[6px] h-11 rounded-[63px] bg-gradient-to-r from-[#4686fe] to-[#1769ff] transition-all duration-300 ease-in-out"
              style={{
                width: pillStyle.width,
                transform: `translateX(${pillStyle.left}px)`,
                left: 0,
              }}
            />
            <div className="relative z-10 flex items-center">
              {RESULTS_REAL_PEOPLE_FILTER_ORDER.map((filterKey, index) => (
                <button
                  key={filterKey}
                  ref={(el) => {
                    filterRefs.current[index] = el;
                  }}
                  onClick={() => setActiveFilter(filterKey)}
                  className={`whitespace-nowrap px-6 py-[6px] font-bold transition-colors duration-300 ${
                    activeFilter === filterKey
                      ? "text-[16px] text-white md:text-[20px]"
                      : "text-[14px] text-[#12121299] md:text-[16px]"
                  }`}
                >
                  {RESULTS_REAL_PEOPLE_FILTER_LABELS[filterKey]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div
            ref={desktopScrollRef}
            className="flex h-[445px] gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredItems.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.key}
                  ref={(el) => {
                    desktopCardRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => scrollDesktopTo(index)}
                  className="relative h-full flex-shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#F7F7F7]"
                  style={{
                    width: isActive ? 751 : 111,
                    transition: "width 420ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Image
                    src={item.desktopSrc}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: isActive ? "center center" : "82% center" }}
                    sizes={isActive ? "(min-width: 1280px) 751px, 60vw" : "(min-width: 1280px) 111px, 10vw"}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(24,30,37,0.96) 0%, rgba(24,30,37,0.18) 48%, rgba(24,30,37,0.04) 100%)",
                    }}
                  />
                  {!isActive && <div className="absolute inset-0 bg-black/5" />}

                  <div className={`absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <div className="flex items-end justify-between gap-6">
                      <div className="min-w-0 max-w-[470px]">
                        <div className="mb-3 inline-flex rounded-[8px] border border-white/15 bg-white/25 px-[10px] py-[4px] backdrop-blur-[5px]">
                          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[20px] font-semibold leading-[1.35] text-white">“{item.quote}”</p>
                      </div>
                      <div className="flex-shrink-0">
                        <VariantCTA variant={item.variant} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <ArrowButton
              direction="left"
              onClick={() => scrollDesktopTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              gradientId="results-real-people-desktop-left"
            />
            <ArrowButton
              direction="right"
              onClick={() => scrollDesktopTo(activeIndex + 1)}
              disabled={activeIndex === filteredItems.length - 1}
              gradientId="results-real-people-desktop-right"
            />
          </div>
        </div>

        <div className="md:hidden">
          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.key}
                data-results-real-people-mobile-card=""
                className="relative h-[400px] w-[320px] flex-shrink-0 snap-center overflow-hidden rounded-[12px] bg-[#181E25]"
              >
                <Image src={item.mobileSrc} alt={item.alt} fill className="object-cover object-center" sizes="320px" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(24,30,37,0.96) 0%, rgba(24,30,37,0.18) 48%, rgba(24,30,37,0.04) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-3 inline-flex rounded-[8px] border border-white/15 bg-white/25 px-[10px] py-[4px] backdrop-blur-[5px]">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[16px] font-semibold leading-[1.4] text-white">“{item.quote}”</p>
                  <div className="mt-4">
                    <VariantCTA variant={item.variant} mobile />
                  </div>
                </div>
              </div>
            ))}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-[12px]">
            <ArrowButton
              direction="left"
              onClick={scrollMobilePrev}
              disabled={!canMobilePrev}
              gradientId="results-real-people-mobile-left"
            />
            <div
              className="flex min-w-0 flex-shrink-0 items-center justify-center gap-[8px]"
              style={{
                width: 152,
                height: 44,
                borderRadius: 24,
                background: "rgba(232,234,237,0.72)",
                backdropFilter: "blur(3.5px)",
              }}
            >
              {visibleMobileDots.map((index) => (
                <button
                  key={`${activeFilter}-${index}`}
                  onClick={() => scrollMobileTo(index)}
                  style={{
                    width: index === mobileIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 10,
                    background: index === mobileIndex ? "#121212" : "rgba(18,18,18,0.30)",
                    transition: "all 300ms ease",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <ArrowButton
              direction="right"
              onClick={scrollMobileNext}
              disabled={!canMobileNext}
              gradientId="results-real-people-mobile-right"
            />
          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
