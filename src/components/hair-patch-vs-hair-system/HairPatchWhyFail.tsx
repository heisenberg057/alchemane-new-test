'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const HairPatchWhyFail = () => {
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[56px] md:py-[100px] lg:py-[120px] bg-white">
      <div className="w-full max-w-[1120px] mx-auto px-[16px] md:px-[40px] xl:px-[0px]">

        {/* ── Heading block ── */}
        <div className="flex flex-col items-center text-center mb-[48px] md:mb-[64px]">
          <h2
            style={{
              color: '#121212',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              lineHeight: '115%',
              letterSpacing: '-0.8px',
              maxWidth: '560px',
              margin: 0,
            }}
          >
            Why Hair Patches Often Fail The Confidence Test
          </h2>
        </div>

        {/* ── Problem + Stats row ── */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(24px, 5vw, 56px)',
            alignItems: 'flex-start',
            marginBottom: 'clamp(40px, 6vw, 64px)',
            flexWrap: 'wrap',
          }}
        >
          {/* Problem text — centered */}
          <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: '#FF6B00',
                  borderRadius: '10px',
                  transform: 'rotate(45deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ transform: 'rotate(-45deg)', fontSize: '20px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>!</span>
              </div>
              <h3
                style={{
                  fontSize: 'clamp(17px, 2.2vw, 20px)',
                  fontWeight: 800,
                  color: '#121212',
                  margin: 0,
                  letterSpacing: '-0.3px',
                }}
              >
                The Real Issue with Patches
              </h3>
            </div>
            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: '#555555',
                lineHeight: '1.75',
                margin: 0,
                maxWidth: '640px',
              }}
            >
              Hair patches are designed to save costs, often{' '}
              <strong style={{ color: '#121212', fontWeight: 700 }}>sacrificing natural appearance</strong>.
              With limited styles and{' '}
              <strong style={{ color: '#121212', fontWeight: 700 }}>poor blending</strong>, they may cover
              baldness but don't align with your unique personality or facial structure.
            </p>
          </div>

        </div>

        {/* ── CTA Banner ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            background: 'linear-gradient(130deg, #4686FE 0%, #1155EE 100%)',
            padding: 'clamp(36px, 5vw, 56px) clamp(20px, 5vw, 56px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          {/* Star dots */}
          <div style={{ position: 'absolute', top: '28px',  right: '140px', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.40)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '58px',  right: '100px', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.30)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '18px',  right: '200px', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '38px', left: '60%',  width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
          {/* Streak */}
          <div style={{ position: 'absolute', top: '-10px', right: '60px', width: '2px', height: '100px', background: 'rgba(255,255,255,0.12)', transform: 'rotate(35deg)', borderRadius: '2px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '10px',  right: '40px', width: '1px', height: '60px', background: 'rgba(255,255,255,0.08)', transform: 'rotate(35deg)', borderRadius: '2px', pointerEvents: 'none' }} />

          {/* Text */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '540px' }}>
            <h3
              style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: '1.25',
                letterSpacing: '-0.4px',
                margin: '0 0 10px',
              }}
            >
              A good hair system works when no one knows you're wearing it.
            </h3>
            <p
              style={{
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 500,
                margin: '0 0 24px',
              }}
            >
              That's the standard we live by.
            </p>

            <button
              type="button"
              onClick={scrollToContactForm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: 'clamp(12px, 1.5vw, 15px) clamp(20px, 2.5vw, 28px)',
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                fontWeight: 700,
                color: '#121212',
                cursor: 'pointer',
                letterSpacing: '-0.2px',
                width: 'auto',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Talk to an Expert
              <span
                style={{
                  width: '30px',
                  height: '30px',
                  background: '#121212',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
