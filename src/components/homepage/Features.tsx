import Image from 'next/image';

export const Features = () => {
  return (
    <section className="py-20 bg-[#f5f6f7] flex flex-col items-center">
      <h2 className="text-5xl font-extrabold text-dark text-center mb-12 leading-tight">
        The secret behind our<br />natural hairline
      </h2>

      <div className="flex w-full max-w-[1120px] gap-8">
        {/* Left Side: Feature Image/Video Placeholder */}
        <div className="flex-1 rounded-2xl overflow-hidden relative h-[408px] bg-white shadow-lg">
           <Image 
             src="/assets/mkxm0e6c-toom7qg.png" 
             alt="Natural Hairline Detail" 
             fill 
             className="object-cover"
           />
           {/* Play Button Overlay */}
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-primary ml-1">
                       <path d="M8 5v14l11-7z" />
                    </svg>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Feature List */}
        <div className="flex flex-col gap-5 w-[544px]">
           {/* Features Card */}
           <div className="bg-white px-10 py-8 rounded-2xl shadow-sm border border-dark/5 flex flex-col items-center text-center gap-6">
              {/* Feature 1 */}
              <div className="flex flex-col items-center gap-1">
                 <h3 className="text-xl font-bold text-dark">Looks Just Like Your Own Scalp</h3>
                 <p className="text-lg text-dark-secondary font-medium">Nobody can tell</p>
              </div>
              
              {/* Divider */}
              <div className="h-px w-12 bg-dark/10"></div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center gap-1">
                 <h3 className="text-xl font-bold text-dark">No Harsh or Fake Hairline</h3>
                 <p className="text-lg text-dark-secondary font-medium">Only natural edges</p>
              </div>

              {/* Divider */}
              <div className="h-px w-12 bg-dark/10"></div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center gap-1">
                 <h3 className="text-xl font-bold text-dark">Feels Light, Breathable, Comfortable</h3>
                 <p className="text-lg text-dark-secondary font-medium">Just like your own</p>
              </div>
           </div>

           {/* Bottom Banner */}
           <div className="relative h-[122px] rounded-2xl overflow-hidden shadow-sm group bg-black">
              {/* Image */}
              <div className="absolute left-0 top-0 bottom-0 w-[60%]">
                 <Image 
                   src="/assets/mkxm0e5w-ol2djwt.png" 
                   alt="Real Result" 
                   fill 
                   className="object-cover"
                 />
              </div>
              
              {/* Gradient Fade to Black */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/80 to-black z-10"></div>
              
              {/* Text Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-end pr-10">
                 <p className="text-3xl font-bold text-white text-right leading-tight">
                    No Line. No Shine.<br />Just Real
                 </p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
