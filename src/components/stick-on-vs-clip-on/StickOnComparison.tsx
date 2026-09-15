import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const StickOnComparison = () => {
  const comparisonData = [
    {
      feature: "Daily Wear",
      stickOn: "No\n(continuously wear)",
      clipOn: "Yes\n(daily removal)"
    },
    {
      feature: "Monthly Servicing",
      stickOn: "Required",
      clipOn: "Not required"
    },
    {
      feature: "Shaving Needed",
      stickOn: "Yes",
      clipOn: "No"
    },
    {
      feature: "Active Lifestyle",
      stickOn: "Perfect fit",
      clipOn: "Great for gym &\ndaily activity"
    },
    {
      feature: "Application Type",
      stickOn: "Needs professional",
      clipOn: "Easy to wear yourself"
    }
  ];

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="relative w-full bg-[#F5F6F7] py-[60px] md:py-[80px] lg:py-[120px] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center">

        {/* Heading */}
        <h2 className="text-[#121212] text-[28px] md:text-[36px] lg:text-[44px] font-extrabold leading-tight text-center mb-[32px] md:mb-10 max-w-full">
          Stick-on Systems vs Clip-on Systems
        </h2>

        {/* Comparison Table Container */}
        <div className="w-full max-w-[992px] bg-white rounded-[12px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          
          {/* Scrollable Wrapper for Mobile */}
          <div className="overflow-x-auto w-full">
            <div className="min-w-[360px] md:min-w-0 w-full">
              
              {/* Header Row */}
              <div className="grid grid-cols-[30%_35%_35%] md:grid-cols-3 bg-[#121212] border-b border-[#1212121F]">
                <div className="py-6 md:py-11 px-2 md:px-4 text-center border-r border-[#1212121F] last:border-r-0 flex items-center justify-center">
                  <span className="text-white text-[16px] md:text-[28px] font-bold leading-tight">Feature</span>
                </div>
                <div className="py-6 md:py-11 px-2 md:px-4 text-center border-r border-[#ffffff33] last:border-r-0 flex items-center justify-center">
                  <span className="text-white text-[16px] md:text-[28px] font-bold leading-tight">Stick-On System</span>
                </div>
                <div className="py-6 md:py-11 px-2 md:px-4 text-center flex items-center justify-center">
                  <span className="text-white text-[16px] md:text-[28px] font-bold leading-tight">Clip-On System</span>
                </div>
              </div>

              {/* Data Rows */}
              {comparisonData.map((row, index) => (
                <div key={index} className="grid grid-cols-[30%_35%_35%] md:grid-cols-3 border-b border-[#E5E7EB] last:border-b-0">
                  {/* Feature Cell */}
                  <div className="py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-r border-[#E5E7EB]">
                    <span className="text-[#121212] text-[14px] md:text-[20px] font-bold text-center leading-tight">
                      {row.feature}
                    </span>
                  </div>
                  
                  {/* Stick-On Cell */}
                  <div className="py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-r border-[#E5E7EB]">
                    <span className="text-[#121212] text-[14px] md:text-[20px] text-center whitespace-pre-line leading-relaxed">
                      {row.stickOn}
                    </span>
                  </div>
                  
                  {/* Clip-On Cell */}
                  <div className="py-6 md:py-11 px-2 md:px-4 flex items-center justify-center">
                    <span className="text-[#121212] text-[14px] md:text-[20px] text-center whitespace-pre-line leading-relaxed">
                      {row.clipOn}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
