import Image from 'next/image';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const NaturalHairlineDesign = () => {
  const features = [
    {
      title: "Uneven Hairline Placement",
      description: "Prevents the artificial border look for a natural hairline."
    },
    {
      title: "Lower Density at the Front",
      description: "Gradual transition mimicking natural hair growth patterns."
    },
    {
      title: "Ultra-Thin HD Swiss Lace Base",
      description: "Melts into your scalp for an ultra-realistic appearance."
    },
    {
      title: "Lighter Hair Color for the Front",
      description: "Dyed over to effectively conceal knots and seams."
    },
    {
      title: "Bleached Knots",
      description: "No visible black dots, even under harsh lighting."
    },
    {
      title: "Single-Strand Implantation",
      description: "Mimics real hair growth direction for a flawless look."
    },
    {
      title: "Base Color Matched to Skin Tone",
      description: "Seamlessly blends with Indian skin tones for a perfect match."
    },
  ];

  return (
    <section className="py-20 md:py-[120px] bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
        
        {/* Heading */}
        <h2 className="mb-16 text-center text-[26px] font-extrabold capitalize leading-[120%] tracking-[-0.5px] text-[#121212] md:text-[44px]">
          How we design the world’s<br />
          most natural hairline
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Mobile Video */}
          <div className="w-full overflow-hidden rounded-[24px] shadow-lg lg:hidden">
            <div className="relative aspect-[4/5]">
              <LazyGumletEmbed
                embedSrc="https://play.gumlet.io/embed/69f2f02ba3dc19951f4ed12b?background=false&autoplay=false&loop=false&disable_player_controls=false"
                title="How we design the world's most natural hairline mobile"
                rootMargin="200px 0px"
                placeholderLabel="Tap to load video"
              />
            </div>
          </div>
          
          {/* Left Side - Checklist */}
          <div className="w-full lg:max-w-[500px] flex flex-col gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 mt-1">
                  <Image 
                    src="/assets/icon-check-blue-square.svg" 
                    alt="Check" 
                    width={24} 
                    height={24} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#121212] text-[20px] font-semibold leading-[120%] tracking-[-0.1px]">
                    {feature.title}
                  </h3>
                  <p className="text-[#555555] text-[18px] leading-[26px] tracking-[-0.1px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Video */}
          <div className="hidden w-full overflow-hidden rounded-[24px] shadow-lg lg:block lg:max-w-[640px]">
            <div className="relative aspect-[4/3]">
              <LazyGumletEmbed
                embedSrc="https://play.gumlet.io/embed/69f2f02ba3dc19951f4ed12d?background=false&autoplay=false&loop=false&disable_player_controls=false"
                title="How we design the world's most natural hairline desktop"
                rootMargin="200px 0px"
                placeholderLabel="Tap to load video"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
