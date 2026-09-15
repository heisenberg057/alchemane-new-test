import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const AboutCareers = () => {
  return (
    <section className="w-full bg-white flex flex-col items-center py-[40px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
         
         <div className="bg-[#1769FF]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg mb-4 md:mb-6">
            <span className="text-[#1769FF] font-bold uppercase tracking-wider text-xs md:text-sm">We are hiring</span>
         </div>
         
         <h2 className="text-[28px] md:text-[48px] font-extrabold text-dark mb-4 md:mb-6 leading-tight">
            Open Positions
         </h2>
         
         <p className="text-dark/60 text-[16px] md:text-xl max-w-[600px] mb-8 md:mb-12 font-medium">
            Join our team and be part of transforming the hair industry and lives.
         </p>

         <Link href="/career">
           <button className="bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-[16px] md:text-lg flex items-center gap-2 hover:shadow-lg transition-all shadow-md transform hover:-translate-y-1">
              Join Our Team
              <div className="bg-white/20 rounded-full p-1">
                 <ArrowRight className="w-4 h-4" />
              </div>
           </button>
         </Link>
      </div>
    </section>
  );
};
