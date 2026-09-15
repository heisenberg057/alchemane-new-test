'use client';

import { useEffect, useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LOCATION_SALON_ASSET } from '@/components/shared/locationSalonAssets';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

function ArrowButton({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
  gradientId: string;
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
        width: 56,
        height: 56,
        border: 'none',
        padding: 0,
        flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
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

const locations = [
  { 
    city: "Mumbai", 
    address: "Saffron Building, 202, Linking Rd, above Anushree Reddy Store, Khar (W), Mumbai- 52",
    image: LOCATION_SALON_ASSET.url,
    icon: (
      <div style={{ width: 44, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="19" viewBox="0 0 33 19" fill="none">
          <path d="M1.5 18H3.71017M3.71017 18V10.328M3.71017 18H5.52627M10.3235 7.30318C8.63878 7.30318 5.1185 7.30318 4.51542 7.30318C3.91234 7.30318 3.7273 7.83267 3.71017 8.09742V10.328M10.3235 7.30318V3.70378C10.4549 3.29258 10.8272 2.37555 11.2658 1.99702M10.3235 7.30318V18M11.2658 1.99702V1M11.2658 1.99702C11.7456 2.36879 12.2767 3.17654 12.2767 3.70378V6.12028M12.2767 6.12028H20.9632M12.2767 6.12028V18M20.9632 6.12028V3.70378C21.0602 3.34891 21.3709 2.51074 21.837 1.99702M20.9632 6.12028V18M21.837 1.99702V1M21.837 1.99702C22.1796 2.38569 22.8649 3.27117 22.8649 3.70378C22.8649 4.13638 22.8649 6.28363 22.8649 7.30318M22.8649 7.30318H28.5702C28.8158 7.29755 29.307 7.44851 29.307 8.09742C29.307 8.31679 29.307 9.17324 29.307 10.328M22.8649 7.30318V18M10.3235 18H12.2767M10.3235 18H8.52456M22.8649 18H31.5H29.307C29.307 15.994 29.307 12.5891 29.307 10.328M22.8649 18H20.9632M12.2767 18H14.247M20.9632 18H19.01M3.71017 10.328H29.307M5.52627 18V15.5239C5.52627 15.3499 5.53737 15.1756 5.58227 15.0074C5.7437 14.4029 6.18028 13.4659 7.03398 13.1501C7.53084 13.4824 8.52456 14.3702 8.52456 15.2624C8.52456 16.1547 8.52456 17.4592 8.52456 18M5.52627 18H8.52456M14.247 18V14.2316C14.3098 13.6295 14.8844 12.3065 16.6799 11.832C17.4566 12.0855 19.01 12.9203 19.01 14.2316C19.01 15.5429 19.01 17.2903 19.01 18M14.247 18H19.01M24.5097 18C24.5097 18 24.4183 15.8144 24.5097 15.2624C24.6011 14.7104 25.4178 13.4881 26.0174 13.1501C26.5143 13.4824 27.508 14.3702 27.508 15.2624C27.508 16.1547 27.508 17.4592 27.508 18H24.5097Z" stroke="#121212" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  { 
    city: "Delhi", 
    address: "Plot No. 2, 2nd Floor, Main Road, Hudson Lane, GTB Nagar, Delhi - 110009",
    image: LOCATION_SALON_ASSET.url,
    icon: (
      <div style={{ width: 44, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
          <path d="M4.07174 31.5508H12.269M4.07174 31.5508V26.9594M4.07174 31.5508H0.550781M5.39387 10.6192C4.33617 10.6192 4.07174 11.5023 4.07174 11.9439V21.2174M5.39387 10.6192V7.96958C5.48202 7.70463 5.76407 7.17471 6.18715 7.17471C6.61024 7.17471 7.24486 7.17471 7.50928 7.17471M5.39387 10.6192H27.2704M7.50928 7.17471V3.46531C7.50296 3.28867 7.6773 2.9354 8.42528 2.9354C9.17327 2.9354 10.418 2.9354 10.9468 2.9354M7.50928 7.17471H24.9614M10.9468 2.9354V1.0807C11.0286 0.904058 11.3264 0.550781 11.8628 0.550781C12.3993 0.550781 18.1745 0.550781 20.995 0.550781C21.1713 0.550781 21.5239 0.656764 21.5239 1.0807C21.5239 1.50463 21.5239 2.4938 21.5239 2.9354M10.9468 2.9354H21.5239M21.5239 2.9354H24.4326C24.6089 2.9354 24.9614 3.04138 24.9614 3.46531C24.9614 3.88924 24.9614 6.11488 24.9614 7.17471M24.9614 7.17471H25.883C26.4732 7.17471 27.2704 7.37942 27.2704 7.96958C27.2704 8.18155 27.2704 9.82428 27.2704 10.6192M27.2704 10.6192C27.5248 10.7958 28.0337 11.308 28.0337 11.9439C28.0337 12.3027 28.0337 16.5004 28.0337 21.2174M28.0337 31.5508H20.2017M28.0337 31.5508C28.0337 30.6139 28.0337 28.1216 28.0337 26.9594M28.0337 31.5508H31.5508M20.2017 31.5508V26.9594M20.2017 31.5508H12.269M12.269 31.5508V26.9594M20.2017 21.2174H28.0337M20.2017 21.2174V26.9594M20.2017 21.2174C20.2017 18.9386 19.9561 16.2826 17.8738 15.357C16.8556 14.9044 15.6681 14.8253 14.5821 15.3164C12.5157 16.2507 12.269 18.9496 12.269 21.2174M28.0337 21.2174C28.0337 23.6131 28.0337 24.7307 28.0337 26.9594M20.2017 26.9594H28.0337M12.269 26.9594H4.07174M12.269 26.9594V21.2174M4.07174 26.9594V21.2174M12.269 21.2174H4.07174" stroke="#121212" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>
    )
  },
  { 
    city: "Bangalore", 
    address: "2nd Floor, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008",
    image: LOCATION_SALON_ASSET.url,
    icon: (
      <div style={{ width: 44, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
          <path d="M3.52093 27.5911V15.4815M3.52093 13.7307C3.45676 13.2494 3.77119 11.9789 5.54225 10.7468C6.21599 11.2281 7.56349 12.4986 7.56349 13.7307M3.52093 13.7307H7.56349M3.52093 13.7307V15.4815M7.56349 13.7307C7.56349 13.9221 7.56349 14.9818 7.56349 15.4815M7.56349 27.5911C7.56349 25.2291 7.56349 21.4068 7.56349 18.3508M7.56349 16.3295C7.56349 16.9399 7.56349 17.6236 7.56349 18.3508M7.56349 16.3295H10.2586M7.56349 16.3295C7.56349 15.7382 7.56349 15.9078 7.56349 15.4815M24.7928 16.3295H21.809M7.56349 18.3508H10.6505M24.7928 18.3508H12.7681M10.6505 18.3508H12.7681M10.6505 18.3508V22.971V27.5911M12.7681 18.3508V27.5911M19.3957 27.5911V18.3508H21.5133V27.5911M10.2586 16.3295V13.15C10.2586 12.7796 10.5588 12.4794 10.9292 12.4794H21.1383C21.5087 12.4794 21.809 12.7796 21.809 13.15V16.3295M10.2586 16.3295H21.809M14.7825 7.37795C12.9344 8.45598 12.4724 10.0089 12.4724 10.6506V12.4794H19.8839V10.6506C19.8839 8.72549 18.2724 7.66671 17.4667 7.37795M14.7825 7.37795V5.93415C14.8466 5.77373 15.0327 5.45289 15.2637 5.45289M14.7825 7.37795H17.4667M15.2637 5.45289V4.82409C15.2637 4.66792 15.2942 4.50893 15.3924 4.38749C15.7207 3.98149 16.3437 3.7823 16.835 4.35963C16.9531 4.49839 16.9963 4.68285 16.9963 4.86506V5.45289M15.2637 5.45289H16.9963M17.4667 7.37795C17.4667 7.02502 17.4667 6.24216 17.4667 5.93415C17.4667 5.62614 17.2814 5.48497 17.1888 5.45289H16.9963M0.550781 27.5911H31.5508M3.52093 15.4815H7.56349" stroke="#121212" strokeWidth="1.1" strokeLinecap="round"/>
          <path d="M24.7967 27.5904L24.7967 15.48M24.7967 13.7299C24.7325 13.2487 25.0469 11.9781 26.818 10.7461C27.4917 11.2274 28.8392 12.4979 28.8392 13.7299M24.7967 13.7299H28.8392M24.7967 13.7299L24.7967 15.48M28.8392 13.7299C28.8392 13.9214 28.8392 14.9802 28.8392 15.48M28.8392 27.5904C28.8392 24.1219 28.8392 18.1955 28.8392 15.48M24.7967 15.48H28.8392" stroke="#121212" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>
    )
  },
];

export const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileLocation,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollToCard,
  } = useSnapCarousel({
    itemSelector: '[data-location-card]',
    itemCount: locations.length,
  });

  useEffect(() => {
    setSelectedLocation(mobileLocation);
  }, [mobileLocation]);

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[100px] lg:py-[120px] bg-[#F8F9FA] flex justify-center w-full">
      <div className="w-full max-w-[1280px] px-[16px] md:px-[40px] lg:px-[80px] flex flex-col lg:flex-row lg:items-stretch gap-[40px] lg:gap-[60px]">
         
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="flex flex-col">
            <h2 className="text-[32px] md:text-[40px] lg:text-[44px] font-extrabold text-[#121212] leading-[1.2] lg:leading-[1.1] tracking-[-0.02em] max-w-[500px] mb-8 lg:mb-0">
              Walk Into Any of Our<br /> Premium Salons
            </h2>

            {/* MOBILE ONLY: Carousel Image + Controls */}
            <div className="block lg:hidden w-full mt-4">
              <div 
                ref={mobileScrollRef}
                className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar -mx-[4px] px-[4px]"
              >
                {locations.map((loc, index) => (
                  <div key={index} data-location-card="" className="min-w-full aspect-[16/10] relative rounded-[16px] overflow-hidden shadow-sm snap-center">
                    <Image src={loc.image} alt={loc.city} fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Controls: ghost left | dots pill | blue right */}
              <div className="flex items-center justify-center gap-[12px] mt-6 mb-8 w-full">
                <ArrowButton
                  direction="left"
                  onClick={scrollMobilePrev}
                  disabled={!canScrollMobilePrev}
                  gradientId="locations-mobile-left"
                />

                {/* Dots pill */}
                <div
                  className="flex items-center justify-center gap-[8px] flex-shrink-0"
                  style={{
                    width: 152, height: 44, borderRadius: 24,
                    background: 'rgba(232,234,237,0.72)',
                    backdropFilter: 'blur(3.5px)',
                    WebkitBackdropFilter: 'blur(3.5px)',
                  }}
                >
                  {locations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToCard(idx)}
                      style={{
                        width: selectedLocation === idx ? 32 : 8,
                        height: 8,
                        borderRadius: 999,
                        background: selectedLocation === idx ? '#121212' : 'rgba(18,18,18,0.30)',
                        transition: 'all 300ms ease',
                        border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                <ArrowButton
                  direction="right"
                  onClick={scrollMobileNext}
                  disabled={!canScrollMobileNext}
                  gradientId="locations-mobile-right"
                />

              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full">
            {locations.map((loc, index) => {
              const isActive = selectedLocation === index;
              return (
                <div 
                  key={index} 
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSelectedLocation(index);
                      scrollToCard(index);
                      return;
                    }
                    setSelectedLocation(index);
                  }}
                  className={`bg-white rounded-[16px] transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive
                      ? 'shadow-[0px_12px_32px_0px_rgba(0,0,0,0.08)] border-transparent' 
                      : 'shadow-sm border border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center justify-between p-[20px] lg:p-[24px]">
                    <div className="flex items-center gap-[12px]">
                      {/* Icon wrapper — consistent size regardless of SVG aspect ratio */}
                      {loc.icon}
                      <h3 className="text-[18px] lg:text-[20px] font-bold text-[#121212]">{loc.city}</h3>
                    </div>
                    <ChevronDown className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-[20px] lg:px-[24px] pb-[24px] pt-0">
                      <p className="text-[#555] text-[15px] mb-5 leading-relaxed">{loc.address}</p>
                      <a
                        href="/contact-us"
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#1769FF] px-[16px] py-[10px] text-[14px] font-semibold text-white"
                      >
                        Get Direction <LocationsDirectionIcon />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 aspect-[4/5] relative rounded-[16px] overflow-hidden shadow-xl">
          <Image 
            src={locations[selectedLocation].image} 
            alt={`${locations[selectedLocation].city} Salon`} 
            fill 
            className="object-cover transition-opacity duration-500"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};

function LocationsDirectionIcon() {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="none"
      aria-hidden="true"
      className="h-[28px] w-[27px] flex-shrink-0"
      style={{ aspectRatio: '1 / 1' }}
    >
      <path d="M18.6667 0.445312H8C3.58172 0.445312 0 4.02703 0 8.44531V19.112C0 23.5303 3.58172 27.112 8 27.112H18.6667C23.0849 27.112 26.6667 23.5303 26.6667 19.112V8.44531C26.6667 4.02703 23.0849 0.445312 18.6667 0.445312Z" fill="white"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6641 9.95052C10.6641 9.49028 11.0372 9.11719 11.4974 9.11719H17.1641C17.6243 9.11719 17.9974 9.49028 17.9974 9.95052V15.6171C17.9974 16.0774 17.6243 16.4505 17.1641 16.4505C16.7038 16.4505 16.3307 16.0774 16.3307 15.6171V11.9624L10.0866 18.2065C9.76122 18.5318 9.23357 18.5318 8.90814 18.2065C8.5827 17.881 8.5827 17.3534 8.90814 17.0279L15.1522 10.7839H11.4974C11.0372 10.7839 10.6641 10.4108 10.6641 9.95052Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient id={gradientId} x1="9.16773" y1="7.02203" x2="20.1122" y2="9.65302" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
