import Image from 'next/image';

export const NaturalHairlineCTA = () => {
  return (
    <section className="py-20 md:py-[120px] bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
        
        {/* Top Tag */}
        <div className="flex items-center gap-1.5 bg-[#1769FF1A] px-3 py-1.5 rounded-[6px] mb-3">
          <StillConfusedIcon />
          <span className="text-[#1769FF] text-[14px] font-medium leading-[20px] tracking-[0.06px]">
             Still Confused?
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-[#121212] text-[36px] md:text-[48px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[800px] mb-6">
           We Understand This Is Not A Small Decision.
        </h2>

        {/* Sub Heading */}
        <p className="text-[20px] md:text-[24px] font-semibold leading-[34px] tracking-[-0.5px] max-w-[700px] mb-9">
           <span className="text-[#121212]">Get in touch with our expert. We’re here</span> <span className="text-[#121212]/50">to provide the guidance you need.</span>
        </p>

        {/* Button */}
        <a href="#contact-form" className="flex items-center gap-2 px-6 py-3.5 rounded-[8px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] shadow-lg hover:shadow-xl transition-all hover:scale-105">
           <span className="text-white text-[18px] font-semibold leading-[25px] tracking-[0.2px]">
              Speak To An Expert
           </span>
           <SpeakToExpertIcon />
        </a>

      </div>
    </section>
  );
};

function StillConfusedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 flex-shrink-0 md:h-[18px] md:w-[18px]"
      style={{ aspectRatio: '1 / 1' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.7376 17.3453C3.08099 17.4071 3.42922 17.4379 3.77812 17.4375C4.88082 17.439 5.96146 17.1286 6.89533 16.5423C7.56871 16.7006 8.27341 16.785 8.99812 16.785C13.6283 16.785 17.4806 13.3311 17.4806 8.955C17.4806 4.5789 13.6283 1.125 8.99812 1.125C4.36798 1.125 0.515625 4.5789 0.515625 8.955C0.515625 11.0508 1.40737 12.9457 2.842 14.342C3.04384 14.5387 3.08299 14.7144 3.06298 14.8144C2.95547 15.3556 2.71173 15.8605 2.3548 16.2813C2.28071 16.3687 2.23096 16.4742 2.21058 16.587C2.19021 16.6998 2.19991 16.816 2.23872 16.9239C2.27753 17.0318 2.34407 17.1275 2.43165 17.2015C2.51924 17.2755 2.62476 17.3251 2.7376 17.3453ZM5.73562 7.97625C5.47604 7.97625 5.2271 8.07937 5.04354 8.26292C4.85999 8.44647 4.75687 8.69542 4.75687 8.955C4.75687 9.21458 4.85999 9.46353 5.04354 9.64708C5.2271 9.83063 5.47604 9.93375 5.73562 9.93375C5.9952 9.93375 6.24415 9.83063 6.4277 9.64708C6.61126 9.46353 6.71437 9.21458 6.71437 8.955C6.71437 8.69542 6.61126 8.44647 6.4277 8.26292C6.24415 8.07937 5.9952 7.97625 5.73562 7.97625ZM8.01937 8.955C8.01937 8.69542 8.12249 8.44647 8.30604 8.26292C8.48959 8.07937 8.73854 7.97625 8.99812 7.97625C9.2577 7.97625 9.50665 8.07937 9.6902 8.26292C9.87376 8.44647 9.97687 8.69542 9.97687 8.955C9.97687 9.21458 9.87376 9.46353 9.6902 9.64708C9.50665 9.83063 9.2577 9.93375 8.99812 9.93375C8.73854 9.93375 8.48959 9.83063 8.30604 9.64708C8.12249 9.46353 8.01937 9.21458 8.01937 8.955ZM12.2606 7.97625C12.001 7.97625 11.7521 8.07937 11.5685 8.26292C11.385 8.44647 11.2819 8.69542 11.2819 8.955C11.2819 9.21458 11.385 9.46353 11.5685 9.64708C11.7521 9.83063 12.001 9.93375 12.2606 9.93375C12.5202 9.93375 12.7692 9.83063 12.9527 9.64708C13.1363 9.46353 13.2394 9.21458 13.2394 8.955C13.2394 8.69542 13.1363 8.44647 12.9527 8.26292C12.7692 8.07937 12.5202 7.97625 12.2606 7.97625Z"
        fill="#1769FF"
      />
    </svg>
  );
}

function SpeakToExpertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 flex-shrink-0 md:h-[28px] md:w-[28px]"
      style={{ aspectRatio: '1 / 1' }}
    >
      <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z"
        fill="url(#speakToExpertGradient)"
      />
      <defs>
        <linearGradient id="speakToExpertGradient" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
