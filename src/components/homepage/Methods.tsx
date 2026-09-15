import { ChevronDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const methods = [
  { 
    id: 1, 
    title: "Stick-On Hair Systems", 
    desc: "No clips, no hassle, just stick, style, and go. Perfect for a natural look all day.", 
    active: true,
    icon: "/assets/stick-on-icon.svg"
  },
  { 
    id: 2, 
    title: "Clip-On Hair Systems", 
    active: false,
    icon: "/assets/clip-on-icon.svg"
  },
];

export const Methods = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[40px] md:py-[60px] lg:py-20 bg-white flex justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between px-[20px] md:px-[60px] lg:px-20 gap-[40px] lg:gap-0">
         {/* Left Content */}
         <div className="flex flex-col justify-center w-full lg:w-[544px]">
            <h2 className="text-[28px] md:text-[36px] lg:text-5xl font-extrabold text-dark mb-[32px] lg:mb-12 leading-tight">
               Our Trusted Methods for<br className="hidden lg:block"/>a Natural Look
            </h2>

            <div className="flex flex-col gap-6">
               {methods.map((method) => (
                  <div key={method.id} className={`flex flex-col w-full p-5 rounded-[16px] border border-[#12121214] bg-[#F5F6F7] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden cursor-pointer ${method.active ? 'gap-3' : ''}`}>
                     <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                           <div className="relative w-6 h-6 flex-shrink-0">
                              <Image src={method.icon} alt={method.title} fill className="object-contain" />
                           </div>
                           <h3 className="text-[20px] font-semibold text-[#121212] tracking-[-0.1px] leading-[24px]">{method.title}</h3>
                        </div>
                        <ChevronDown className={`w-6 h-6 text-[#121212] transition-transform ${method.active ? 'rotate-180' : ''}`} />
                     </div>
                     
                     {method.active && (
                        <>
                           <p className="text-[18px] text-[#555555] leading-[29px] tracking-[-0.16px] w-full max-w-[504px]">
                              {method.desc}
                           </p>
                           <button className="flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white px-3 py-2 rounded-[8px] font-semibold hover:opacity-90 w-fit mt-1">
                              <span className="text-[18px] font-semibold leading-[24px] tracking-[-0.1px]">Explore Now</span>
                              <ArrowRight className="w-5 h-5" />
                           </button>
                        </>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Right Image */}
         <div className="w-full lg:w-[544px] h-[300px] md:h-[500px] lg:h-[711px] rounded-2xl overflow-hidden relative">
            <Image 
               src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-methods-hero-man.png"
               alt="Handsome Man" 
               fill 
               className="object-cover" 
            />
         </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
