
export const HairPatchComparison = () => {
  const features = [
    {
      name: "Sizing",
      patch: "Limited sizes",
      system: "Custom fit",
    },
    {
      name: "Hairline",
      patch: "Fake looking",
      system: "Natural, seamless",
    },
    {
      name: "Look & Feel",
      patch: "Artificial / dense",
      system: "Looks real, soft",
    },
    {
      name: "Lifestyle Fit",
      patch: "Weak hold",
      system: "Active lifestyle ready",
    },
    {
      name: "Comfort",
      patch: "Medium comfort",
      system: "Light & breathable",
    },
    {
      name: "Styles",
      patch: "Standard designs",
      system: "Fully customized",
    },
    {
      name: "Design Process",
      patch: "Glue & wear",
      system: "Consult & custom design",
    },
    {
      name: "Realism",
      patch: "Looks artificial",
      system: "Real & undetectable",
    }
  ];

  return (
    <section className="py-20 md:py-[120px] bg-[#F5F6F7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex flex-col items-center">
        <h2 className="text-[#121212] text-[26px] md:text-[44px] font-extrabold mb-8 md:mb-11 text-center tracking-[-0.5px]">
          Hair Patch Vs. Hair System
        </h2>

        <div className="w-full max-w-[992px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_8px_24px_0px_#0000000D]">
          <div className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-3">
            {/* Headers */}
            <div className="bg-[#121212] py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#1212121F]">
              <span className="font-bold text-[16px] md:text-[28px] text-white tracking-[-0.25px]">Feature</span>
            </div>
            <div className="bg-[#121212] py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#1212121F] border-l border-l-[#ffffff20]">
              <span className="font-bold text-[16px] md:text-[28px] text-white tracking-[-0.25px] text-center">Hair Patch</span>
            </div>
            <div className="bg-[#121212] py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#1212121F] border-l border-l-[#ffffff20]">
              <span className="font-bold text-[16px] md:text-[28px] text-white tracking-[-0.25px] text-center">Hair System</span>
            </div>

            {/* Rows */}
            {features.map((feature, index) => (
              <div key={index} className="contents">
                {/* Feature Name */}
                <div className={`py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#E5E7EB] ${index % 2 === 1 ? 'bg-[#12121205]' : 'bg-white'}`}>
                  <span className="font-bold text-[14px] md:text-[20px] text-[#121212] text-center tracking-[-0.25px]">{feature.name}</span>
                </div>
                
                {/* Patch Value */}
                <div className={`py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#E5E7EB] border-l border-l-[#E5E7EB] ${index % 2 === 1 ? 'bg-[#12121205]' : 'bg-white'}`}>
                  <span className="text-[14px] md:text-[20px] text-[#121212] text-center tracking-[-0.16px] leading-[1.2] md:leading-[24px]">{feature.patch}</span>
                </div>
                
                {/* System Value */}
                <div className={`py-6 md:py-11 px-2 md:px-4 flex items-center justify-center border-b border-[#E5E7EB] border-l border-l-[#E5E7EB] ${index % 2 === 1 ? 'bg-[#12121205]' : 'bg-white'}`}>
                  <span className="text-[14px] md:text-[20px] text-[#121212] text-center tracking-[-0.16px] leading-[1.2] md:leading-[24px]">{feature.system}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
