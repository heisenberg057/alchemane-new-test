import React from 'react';

export const HairTransplantCandidates = () => {
  return (
    <section className="bg-[#F5F6F7] py-12 md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center">
        <h2 className="text-3xl md:text-[44px] font-extrabold text-[#121212] text-center mb-8 md:mb-[44px] tracking-[-0.5px]">
          Who Is This For?
        </h2>

        <div className="w-full max-w-[1120px] mx-auto p-6 md:p-[44px_32px] rounded-[16px] border border-[#12121214] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
          <h3 className="text-[20px] font-bold text-[#121212] mb-8">This combination is ideal if:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
             <div className="space-y-6">
                <Item text="Your donor area isn't enough for complete coverage." highlight="donor area" />
                <Item text="You're willing to invest in the best long-term solution." highlight="invest in the best" />
                <Item text="You want a front hairline that looks natural, including temples." highlight="front hairline" />
                <Item text="You know a full transplant won't give side-and-back density." highlight="full transplant" />
                <Item text="You want a complete look, not just coverage, but proper design." highlight="complete look" />
             </div>
             <div className="space-y-6">
                <Item text="You're focused on uniform density from front to crown." highlight="uniform density" />
                <Item text="You care about face aesthetics, not just hair quantity." highlight="face aesthetics" />
                <Item text="You want a brush-back style without exposing bald spots." highlight="brush-back style" />
                <Item text="You've had a failed transplant that didn't deliver density." highlight="failed transplant" />
                <Item text="You want undetectable blending even if someone touches your scalp." highlight="undetectable blending" />
             </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.25px]">
            <span className="text-[#121212]/50">If you want an extremely </span>
            <span className="text-[#121212]">natural hairline with good density,</span>
            <br />
            <span className="text-[#121212]">then this method is designed for you.</span>
        </p>
      </div>
    </section>
  );
};

const Item = ({ text, highlight }: { text: string; highlight: string }) => {
    const parts = text.split(highlight);
    return (
        <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-[3px]">
                <path d="M6.35467 2H17.6453C18.2387 2 18.7333 2 19.1387 2.03333C19.56 2.06667 19.9573 2.14133 20.332 2.33333C20.9067 2.62667 21.3733 3.09333 21.6667 3.668C21.8587 4.044 21.9333 4.44 21.9667 4.86133C22 5.26667 22 5.76133 22 6.35467V17.6453C22 18.2387 22 18.7333 21.9667 19.1387C21.9333 19.56 21.8587 19.9573 21.6667 20.332C21.3747 20.9067 20.908 21.3733 20.3333 21.6667C19.9587 21.8587 19.5613 21.9333 19.14 21.9667C18.7347 22 18.24 22 17.6467 22H6.35467C5.76133 22 5.26667 22 4.86133 21.9667C4.448 21.9467 4.04133 21.8453 3.66667 21.6667C3.09333 21.3733 2.62667 20.9067 2.33333 20.3333C2.15467 19.96 2.05333 19.5533 2.03333 19.14C2 18.7333 2 18.2387 2 17.6453V6.35467C2 5.76133 2 5.26667 2.03333 4.86133C2.06667 4.44 2.14133 4.044 2.33333 3.668C2.62667 3.09333 3.09333 2.62667 3.668 2.33333C4.044 2.14133 4.44 2.06667 4.86133 2.03333C5.26667 2 5.76133 2 6.35467 2ZM16.4747 10.272C16.692 10.0627 16.7787 9.752 16.7027 9.46133C16.6253 9.16933 16.3987 8.94267 16.1067 8.86667C15.816 8.78933 15.5053 8.87733 15.2973 9.09333L10.884 13.504L9.25067 11.8707C8.924 11.544 8.396 11.5453 8.07067 11.8707C7.74533 12.1973 7.74533 12.724 8.072 13.0507L10.2947 15.272C10.62 15.5973 11.148 15.5973 11.4733 15.272L16.4733 10.272H16.4747Z" fill="#1769FF"/>
            </svg>
            <p className="text-[18px] text-[#555555] leading-[1.55] tracking-[-0.16px]">
                {parts[0]}
                <span className="font-bold text-[#121212]">{highlight}</span>
                {parts[1]}
            </p>
        </div>
    );
};
