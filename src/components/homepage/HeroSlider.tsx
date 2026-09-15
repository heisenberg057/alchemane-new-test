import Image from 'next/image';

const R2 = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

const clients = [
  {
    name: "Sameer Warma",
    quote: "I was amazed at how comfortable and natural the system feels. It’s exactly what I needed.",
    image: `${R2}/runtime-hero-slider-1.png`,
  },
  {
    name: "Daljit Singh",
    quote: "From consultation to final result, the team at American Hairline was incredible. I love my new look!",
    image: `${R2}/runtime-hero-slider-2.png`,
  },
  {
    name: "Advik Sharma",
    quote: "The hair system fits perfectly and looks completely natural. I feel so confident every day!",
    image: `${R2}/runtime-hero-slider-3.png`,
  },
  {
    name: "Fuzail Khan",
    quote: "It blends seamlessly with my natural hair. I feel like myself again, but better!",
    image: `${R2}/runtime-hero-slider-4.png`,
  },
  {
    name: "Chandan Singh",
    quote: "The hair system feels like my own hair. It’s comfortable, natural, and gives me the perfect look.",
    image: `${R2}/runtime-hero-slider-5.png`,
  },
];

export const HeroSlider = () => {
  return (
    <div className="w-full overflow-x-auto pb-[120px] hide-scrollbar bg-white">
      <div className="flex gap-[25px] px-4 min-w-max justify-center">
        {clients.map((client, index) => (
          <div key={index} className="relative w-[368px] h-[460px] rounded-[16px] overflow-hidden group flex-shrink-0">
            {/* Background Image */}
            <Image 
              src={client.image} 
              alt={client.name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181e25] via-[#181e2500] to-transparent flex flex-col justify-end p-[20px] pb-[16px]">
               <div className="bg-[#ffffff40] backdrop-blur-[6px] self-start px-[8px] py-[4px] rounded-[8px] mb-[12px]">
                  <span className="text-white text-[16px] font-semibold uppercase tracking-[0.4px] leading-[22px]">{client.name}</span>
               </div>
               <p className="text-white text-[18px] font-semibold leading-[23px] tracking-[-0.25px]">
                  <span className="opacity-100">"{client.quote}"</span>
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
