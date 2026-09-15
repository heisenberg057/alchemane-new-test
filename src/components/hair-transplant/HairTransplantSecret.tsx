import Image from 'next/image';
import { HT_SECRET_ASSETS } from './hairTransplantAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const benefits = [
  "Extremely natural hairline with good density, including the temples.",
  "Full, camera-ready density.",
  "No thinning from any angle.",
  "Style versatility without the sacrifice.",
  "A flawless, undetectable finish."
];

export const HairTransplantSecret = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white py-[72px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] mb-10 md:mb-14">
          The Secret Behind Most<br />
          Bollywood Actors&apos; Hair
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

          {/* ── Left: benefit list + CTA ── */}
          <div className="w-full md:flex-1 flex flex-col gap-6">
            <div className="bg-[#F5F6F7] rounded-2xl p-6 md:p-8">
              <h3 className="text-[16px] md:text-[18px] font-bold text-dark mb-5">
                The Hybrid Method gives you:
              </h3>
              <div className="flex flex-col gap-4">
                {benefits.map((text, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-[3px] w-5 h-5 rounded-full bg-dark flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.2 7.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-[14px] md:text-[16px] text-dark leading-[1.65]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA button — full width, 56px tall, Figma SVG icon */}
            <button
              style={{
                height: 56,
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                alignSelf: 'stretch',
                width: '100%',
                background: 'linear-gradient(135deg, #4686FE, #1769FF)',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <span className="text-white font-bold text-[16px]">Talk to an Expert</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#paint0_linear_secret)" />
                <defs>
                  <linearGradient id="paint0_linear_secret" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4686FE" />
                    <stop offset="1" stopColor="#1769FF" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>

          {/* ── Right: image ── */}
          <div className="w-full md:w-auto md:flex-shrink-0">
            {/* Mobile — 358×448 (175/219) */}
            <div
              className="relative w-full rounded-2xl overflow-hidden md:hidden"
              style={{ aspectRatio: '175/219' }}
            >
              <Image
                src={HT_SECRET_ASSETS.mobile.url}
                alt={HT_SECRET_ASSETS.mobile.alt}
                fill
                className="object-cover object-center"
                sizes="calc(100vw - 32px)"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-[14px] font-semibold leading-[1.6]">
                  Spot perfect hairlines in Bollywood? It&apos;s the{' '}
                  <span className="font-bold">Front Hairline Transplant + Hair System</span> at the back.
                </p>
              </div>
            </div>

            {/* Desktop — 545×409 (541/406) */}
            <div
              className="relative rounded-2xl overflow-hidden hidden md:block"
              style={{ width: 545, aspectRatio: '541/406' }}
            >
              <Image
                src={HT_SECRET_ASSETS.desktop.url}
                alt={HT_SECRET_ASSETS.desktop.alt}
                fill
                className="object-cover object-center"
                sizes="545px"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-[16px] font-semibold leading-[1.6]">
                  Spot perfect hairlines in Bollywood? It&apos;s the{' '}
                  <span className="font-bold">Front Hairline Transplant + Hair System</span> at the back.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
