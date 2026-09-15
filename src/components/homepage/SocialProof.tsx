import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const SocialProof = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F0F2F5] md:bg-[#F5F6F7] flex justify-center py-[64px] px-[16px] md:py-[80px] lg:py-[120px] md:px-[20px]">
      <div className="w-full max-w-[358px] md:max-w-[1120px] bg-[#121212] rounded-[20px] md:rounded-[16px] px-[20px] pt-[26px] pb-[18px] md:p-[32px_24px] lg:p-[64px] flex flex-col items-start md:items-center relative shadow-[0px_24px_60px_0px_rgba(18,18,18,0.12)] overflow-hidden">
        
        {/* Badge */}
        <div className="flex items-center gap-[6px] bg-[#ffffff26] border border-white/10 backdrop-blur-[20px] px-[10px] py-[6px] rounded-[8px] mb-[18px] md:mb-[16px] self-start md:self-center">
          <div className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] relative">
             <Image src="/assets/mlg2rlvn-hca6p1f.svg" alt="Heart" fill className="object-contain" />
          </div>
          <span className="text-white font-bold text-[14px] leading-none tracking-[0.4px] uppercase">Happy Clients</span>
        </div>

        {/* Heading */}
        <h2 className="text-white text-[28px] md:text-[26px] lg:text-[32px] font-extrabold leading-[34px] md:leading-[1.2] tracking-[-0.8px] mb-[30px] md:mb-[32px] lg:mb-[52px] text-left md:text-center max-w-none md:max-w-none">
          Trusted By Thousands
        </h2>

        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[40px] w-full justify-center items-center">
          
          {/* Google Rating Card */}
          <div className="relative w-full max-w-[318px] md:max-w-[413px] min-h-[93px] md:h-[92px] lg:h-[118px] rounded-[12px] border border-[#666666] bg-[rgba(18,18,18,0.25)] backdrop-blur-[20px] px-[20px] py-[20px] overflow-hidden">
             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_34%)]" />
             <div className="relative z-10 flex h-full items-center justify-center w-full">
                <div className="w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] relative flex-shrink-0">
                   <Image src="/assets/mlg2rlvn-y8dzcdj.svg" alt="Google" fill className="object-contain" />
                </div>
                
                <div className="ml-[12px] md:ml-[16px] flex min-w-0 flex-col">
                   <div className="flex items-center gap-[6px]">
                      <span className="text-white text-[20px] md:text-[22px] lg:text-[26px] font-bold leading-none tracking-[-0.5px]">4.9</span>
                      <div className="flex relative top-[1px]">
                         {[1, 2, 3, 4].map((_, i) => (
                           <div key={i} className="w-[20px] h-[20px] md:w-[18px] md:h-[18px] lg:w-[24px] lg:h-[24px] relative">
                             <Image src="/assets/mlg2rlvn-ydd7c9s.svg" alt="Star" fill className="object-contain" />
                           </div>
                         ))}
                         <div className="w-[20px] h-[20px] md:w-[18px] md:h-[18px] lg:w-[24px] lg:h-[24px] relative">
                            <div className="absolute top-[2px] left-[3px] w-[15px] h-[14px] lg:w-[21px] lg:h-[20px]">
                               <Image src="/assets/mlg2rlvn-e3qdktq.svg" alt="Star Part 1" fill className="object-contain" />
                            </div>
                            <div className="absolute top-0 left-0 w-[19px] h-[19px] lg:w-[26px] lg:h-[26px]">
                               <Image src="/assets/mlg2rlvn-4rn9huc.svg" alt="Star Part 2" fill className="object-contain" />
                            </div>
                         </div>
                      </div>
                   </div>
                   <span className="text-white/60 text-[15px] md:text-[16px] lg:text-[24px] font-semibold leading-[1.15] mt-[4px] lg:mt-2">Google Rating</span>
                </div>

                <div className="ml-auto w-[62px] flex-shrink-0 text-center text-white/50 text-[14px] md:text-[13px] lg:text-[18px] font-normal leading-[22px] tracking-[-0.1px]">
                   300+<br/>reviews
                </div>
             </div>
          </div>

          {/* YouTube Card */}
          <div className="relative w-full max-w-[318px] md:max-w-[413px] min-h-[93px] md:h-[92px] lg:h-[118px] rounded-[12px] border border-[#666666] bg-[rgba(18,18,18,0.25)] backdrop-blur-[20px] px-[20px] py-[20px] overflow-hidden">
             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_34%)]" />
             <div className="relative z-10 flex h-full items-center justify-center w-full">
                <div className="w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] relative flex-shrink-0">
                   <Image src="/assets/mlg2s3tl-vsuwlea.svg" alt="YouTube" fill className="object-contain" />
                </div>
                
                <div className="ml-[12px] md:ml-[16px] flex min-w-0 flex-col justify-center">
                   <div className="flex items-center gap-1">
                      <span className="text-white text-[19px] md:text-[22px] lg:text-[25px] font-bold leading-none tracking-[-0.5px]">50K+</span>
                      <span className="text-white text-[16px] font-bold leading-none tracking-[-0.5px] ml-1">Subscribers</span>
                   </div>
                   <span className="text-white/60 text-[15px] md:text-[16px] lg:text-[24px] font-semibold leading-[1.15] mt-[4px] lg:mt-2">on YouTube</span>
                </div>

                <div className="ml-auto w-[74px] flex-shrink-0 text-center text-white/50 text-[14px] md:text-[13px] lg:text-[18px] font-normal leading-[22px] tracking-[-0.1px]">
                   Growing<br/>community
                </div>
             </div>
          </div>

        </div>

        {/* Divider (Mobile) */}
        <div className="w-full h-[1px] bg-[#FFFFFF1A] mt-[40px] md:hidden"></div>

        {/* Footer Text */}
        <div className="mt-[16px] md:mt-[32px] lg:mt-[64px] w-full pt-0 md:pt-[16px] text-center">
           <div className="hidden md:block w-full lg:w-[992px] h-[1px] bg-white/10 mx-auto mb-[16px]"></div>
           <p className="text-white/50 md:text-[#ffffffb2] text-[14px] lg:text-[18px] font-normal md:font-medium leading-[22px] tracking-[-0.1px]">
             Join our community of satisfied customers
           </p>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
