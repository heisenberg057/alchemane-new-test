import Image from 'next/image';

export const NaturalHairlineClients = () => {
  return (
    <section className="py-20 md:py-[120px] bg-[#F5F6F7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
        
        {/* Heading */}
        <h2 className="text-[#121212] text-[36px] md:text-[44px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[640px] mb-12">
          Some Of Our Clients With The Most Natural Hairlines
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Card (Hrithik) */}
          <div className="flex flex-col gap-4 md:col-span-8">
             <div className="relative w-full h-[403px] md:h-[clamp(280px,28vw,403px)] rounded-[12px] overflow-hidden group cursor-pointer shadow-sm">
                <Image 
                   src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-hrithik.png" 
                   alt="Hrithik Bahl" 
                   fill 
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                   sizes="(min-width: 768px) 66vw, 100vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#181E25] via-[#181E25]/60 to-transparent"></div>

                {/* Quote */}
                <div className="absolute bottom-6 left-7 right-16">
                   <p className="text-white text-[20px] font-semibold leading-[26px] tracking-[-0.4px]">
                      "As a therapist, I needed to look sharp. This system gave me that edge, naturally."
                   </p>
                </div>

                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] transition-transform duration-300 group-hover:scale-110">
                   <Image 
                      src="/assets/play-circle-icon.svg" 
                      alt="Play" 
                      fill 
                      className="drop-shadow-lg"
                   />
                </div>
             </div>
             
             {/* Name/Role */}
             <div className="flex flex-col gap-1">
                <h3 className="text-[#121212] text-[20px] font-medium leading-[24px] tracking-[-0.1px]">Hrithik Bahl</h3>
                <p className="text-[#55555580] text-[18px] font-medium leading-[22px] tracking-[-0.16px]">Physical Therapist</p>
             </div>
          </div>

          {/* Right Cards Container */}
          <div className="flex gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide md:col-span-4 md:grid md:grid-cols-2 md:pb-0">
             
             {/* Arnav */}
             <div className="flex flex-col gap-4 min-w-[178px] md:min-w-0">
                <div className="relative w-[178px] md:w-full h-[403px] md:h-[clamp(280px,28vw,403px)] rounded-[12px] overflow-hidden group cursor-pointer shadow-sm">
                   <Image 
                      src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-arnav.png" 
                      alt="Arnav Mukherjee" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 17vw, 178px"
                   />
                   <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#181E25] to-transparent"></div>
                   
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] transition-transform duration-300 group-hover:scale-110">
                      <Image src="/assets/play-circle-icon.svg" alt="Play" fill className="drop-shadow-lg" />
                   </div>
                </div>
                <div className="flex flex-col gap-1">
                   <h3 className="text-[#121212] text-[20px] font-medium leading-[24px] tracking-[-0.1px]">Arnav Mukherjee</h3>
                   <p className="text-[#55555580] text-[18px] font-medium leading-[22px] tracking-[-0.16px]">Entrepreneur</p>
                </div>
             </div>

             {/* Aryan */}
             <div className="flex flex-col gap-4 min-w-[178px] md:min-w-0">
                <div className="relative w-[178px] md:w-full h-[403px] md:h-[clamp(280px,28vw,403px)] rounded-[12px] overflow-hidden group cursor-pointer shadow-sm">
                   <Image 
                      src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-client-aryan.png" 
                      alt="Aryan Bera" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 17vw, 178px"
                   />
                   <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#181E25] to-transparent"></div>
                   
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] transition-transform duration-300 group-hover:scale-110">
                      <Image src="/assets/play-circle-icon.svg" alt="Play" fill className="drop-shadow-lg" />
                   </div>
                </div>
                <div className="flex flex-col gap-1">
                   <h3 className="text-[#121212] text-[20px] font-medium leading-[24px] tracking-[-0.1px]">Aryan Bera</h3>
                   <p className="text-[#55555580] text-[18px] font-medium leading-[22px] tracking-[-0.16px]">Civil Engineer</p>
                </div>
             </div>

          </div>

        </div>

      </div>
    </section>
  );
};
