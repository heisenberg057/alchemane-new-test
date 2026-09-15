import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const stats = [
  { value: "12+ Years", label: "Experience" },
  { value: "6,770+", label: "Men Helped" },
  { value: "100%", label: "Natural Looking" },
  { value: "12+ Nations", label: "Client Base" },
];

export const Stats = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#f5f6f7] flex justify-center">
      <div className="w-full max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px] flex flex-col lg:flex-row justify-between items-center lg:items-start gap-[40px] lg:gap-0">
         {/* Left Text */}
         <div className="flex flex-col gap-[32px] lg:gap-[122px] w-full lg:w-auto items-center lg:items-start text-center lg:text-left">
            <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] leading-tight lg:leading-[53px] tracking-[-0.5px]">
               Why Men Around the<br />World Choose Us
            </h2>
            <a href="#contact-form" className="hidden lg:flex items-center justify-center gap-2 bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white w-full lg:w-[288px] h-[56px] rounded-xl font-semibold shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
               <span className="text-[18px] tracking-[0.2px]">Talk to an Expert</span>
               <StatsTalkToExpertIcon gradientId="stats-cta-arrow-desktop" />
            </a>
         </div>

         {/* Right Grid */}
         <div className="grid grid-cols-2 gap-[16px] lg:gap-5 w-full lg:w-auto">
            {stats.map((stat, index) => (
               <div key={index} className="bg-white rounded-[16px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)] border-[2px] border-[#12121214] flex flex-col items-center justify-center w-full lg:w-[262px] h-[120px] lg:h-[151px] hover:-translate-y-1 transition-transform duration-300 p-4 text-center">
                  <p className="text-[24px] lg:text-[30px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4686FE] to-[#1769FF] mb-1 lg:mb-2 leading-tight lg:leading-[39px] tracking-[1px]">
                     {stat.value}
                  </p>
                  <p className="text-[16px] lg:text-[22px] font-normal text-[#555555] leading-tight lg:leading-[24px] tracking-[-0.16px]">{stat.label}</p>
               </div>
            ))}
         </div>

         <a href="#contact-form" className="flex lg:hidden items-center justify-center gap-2 bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white w-full h-[56px] rounded-xl font-semibold shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
            <span className="text-[18px] tracking-[0.2px]">Talk to an Expert</span>
            <StatsTalkToExpertIcon gradientId="stats-cta-arrow-mobile" />
         </a>
      </div>
    </section>
    </AnimateOnScroll>
  );
};

function StatsTalkToExpertIcon({ gradientId }: { gradientId: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7 flex-shrink-0 lg:h-[28px] lg:w-[26.667px]"
      style={{ aspectRatio: '1 / 1' }}
    >
      <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient id={gradientId} x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
