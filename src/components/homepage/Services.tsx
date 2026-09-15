'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { SERVICES_ASSETS } from './servicesAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const services = SERVICES_ASSETS;

export const Services = () => {
  const [activeService, setActiveService] = useState(0);

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[100px] lg:py-[120px] bg-[#F8F9FA] flex justify-center w-full">
      {/* items-stretch ensures the left column div matches the height 
          of the image on the right automatically.
      */}
      <div className="w-full max-w-[1280px] px-[16px] md:px-[40px] lg:px-[80px] flex flex-col lg:flex-row items-center lg:items-stretch gap-[40px] lg:gap-[60px]">
        
        {/* Left Content Column */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          
          <div>
            {/* Heading: Locked to 2 lines via max-width and manual break */}
            <h2 className="text-[32px] md:text-[40px] lg:text-[44px] font-extrabold text-[#121212] leading-[1.2] lg:leading-[1.1] tracking-[-0.02em] max-w-[500px]">
              Explore Our Trusted Range Of Hair Services
            </h2>

            {/* Mobile Image - Only visible on small screens */}
            <div className="block lg:hidden w-full max-w-[358px] aspect-[358/220] relative rounded-[16px] overflow-hidden shadow-sm mt-[32px] mb-[24px] mx-auto">
               <Image 
                  src={services[activeService].mobileImageSrc} 
                  alt={services[activeService].imageAlt} 
                  fill 
                  className="object-cover transition-opacity duration-500" 
                  sizes="(max-width: 390px) calc(100vw - 32px), 358px"
               />
            </div>
          </div>

          {/* Accordion Container: Anchored to the bottom because of justify-between */}
          <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full mt-8 lg:mt-0">
            {services.map((service, index) => {
              const isActive = activeService === index;
              return (
                <div 
                  key={service.id} 
                  onClick={() => setActiveService(index)}
                  className={`bg-white rounded-[16px] transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'shadow-[0px_12px_32px_0px_rgba(0,0,0,0.08)] border border-transparent' 
                      : 'shadow-sm border border-[#E5E7EB] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between p-[20px] lg:p-[24px]">
                    <div className="flex items-center gap-[12px] lg:gap-[16px]">
                      <div className="w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] relative flex items-center justify-center flex-shrink-0">
                        <Image src={service.icon} alt={service.title} width={32} height={32} className="object-contain" />
                      </div>
                      <h3 className="text-[16px] lg:text-[18px] font-bold text-[#121212] leading-[1.2]">{service.title}</h3>
                    </div>
                    <ChevronDown className={`w-[20px] h-[20px] text-[#121212] transition-transform duration-300 flex-shrink-0 ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-[20px] lg:px-[24px] pb-[24px] pt-0">
                      <p className="text-[14px] lg:text-[15px] text-[#555] mb-[20px] leading-[1.6]">
                        {service.desc}
                      </p>
                      
                      <Link
                        href={service.href}
                        className="flex items-center justify-center gap-[8px] bg-[#1769FF] text-white px-[16px] py-[10px] rounded-[8px] font-semibold text-[14px] hover:bg-[#145ce6] transition-colors w-max"
                      >
                        <span>Explore Now</span>
                        <div className="bg-white text-[#1769FF] rounded-[4px] p-[2px] w-[20px] h-[20px] flex items-center justify-center">
                          <ArrowUpRight className="w-[14px] h-[14px] stroke-[3]" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Image Column: This height (aspect-4/5) now dictates the vertical bounds */}
        <div className="hidden lg:block lg:w-1/2 max-w-[544px] aspect-[101/132] relative rounded-[16px] overflow-hidden shadow-lg">
          <Image 
            src={services[activeService].desktopImageSrc} 
            alt={services[activeService].imageAlt} 
            fill 
            className="object-cover transition-opacity duration-500"
            sizes="(min-width: 1024px) 544px, 50vw"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
