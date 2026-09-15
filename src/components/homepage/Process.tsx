import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

const steps = [
  { id: 1, title: "Consultation", desc: "Meet our expert to discuss your hair goals" },
  { id: 2, title: "Customization", desc: "Get a solution tailored exactly for you" },
  { id: 3, title: "Transformation", desc: "See your new look come alive instantly" },
];

export const Process = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#f5f6f7] flex flex-col items-center">
      <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-extrabold text-[#121212] text-center mb-[32px] lg:mb-[44px] leading-tight lg:leading-[53px] tracking-[-0.5px] px-[20px]">
        The Step-by-Step Process<br className="hidden lg:block"/>to Natural Hair
      </h2>

      <div className="flex flex-col lg:flex-row w-full max-w-[1120px] gap-[32px] items-center px-[20px] lg:px-0">
         {/* Left: Video — phone (4:5) */}
         <div className="block lg:hidden w-full rounded-[16px] overflow-hidden shadow-lg" style={{ position: 'relative', aspectRatio: '4/5' }}>
            <LazyGumletEmbed
              title="Hair transformation process video"
              embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd92?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="180px 0px"
              placeholderLabel="Load the process video only when needed"
            />
         </div>

         {/* Left: Video — desktop (4:3) */}
         <div className="hidden lg:block lg:w-[544px] rounded-[16px] overflow-hidden shadow-lg" style={{ position: 'relative', aspectRatio: '4/3' }}>
            <LazyGumletEmbed
              title="Hair transformation process video"
              embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="260px 0px"
              placeholderLabel="Video loads only when this section is near"
            />
         </div>

         {/* Right: Steps */}
         <div className="flex flex-col gap-[20px] w-full lg:w-[544px]">
            <div className="bg-white rounded-[16px] px-[20px] md:px-[39px] py-[32px] md:py-[40px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
               {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center text-center gap-[4px]">
                     <h3 className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">Step {step.id}: {step.title}</h3>
                     <p className="text-[18px] font-medium text-[#555555] leading-[22px] tracking-[-0.16px]">{step.desc}</p>

                     {index !== steps.length - 1 && (
                        <div className="w-[48px] h-[2px] bg-[#1212121a] rounded-full mt-[12px] mb-[8px]"></div>
                     )}
                  </div>
               ))}
            </div>

            <a href="#contact-form" className="flex items-center justify-center gap-[8px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white h-[56px] w-full rounded-[12px] font-semibold text-[18px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
               <span className="leading-[25px] tracking-[0.2px]">Discuss With a Consultant</span>
               <ProcessConsultantIcon />
            </a>
         </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};

function ProcessConsultantIcon() {
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
        fill="url(#processConsultantGradient)"
      />
      <defs>
        <linearGradient id="processConsultantGradient" x1="9.16773" y1="7.02203" x2="20.1122" y2="9.65302" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
