'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { DEFAULT_SETTINGS } from '@/lib/settings/parseSettingsPayload';

type MobilePanel = 'root' | 'guide' | 'clip' | 'solutions';

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────────

function SocialIcons() {
  const { data: site = DEFAULT_SETTINGS } = useSiteSettings();
  return (
    <div className="flex items-center gap-4">
      <a href={site.socialFacebook || DEFAULT_SETTINGS.socialFacebook} target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#121212"/>
          <path d="M15 8h-2a1 1 0 00-1 1v2h3l-.5 3H12v6H9v-6H7v-3h2V9a3 3 0 013-3h3v2z" fill="white"/>
        </svg>
      </a>
      <a href={site.socialInstagram || DEFAULT_SETTINGS.socialInstagram} target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#121212"/>
          <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5"/>
          <circle cx="16" cy="8" r="1" fill="white"/>
        </svg>
      </a>
      <a href={site.socialX || DEFAULT_SETTINGS.socialX} target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#121212"/>
          <path d="M6 6l5 6.5L6 18h2l4-4.5 3.5 4.5H18l-5.3-6.8L17.5 6h-2l-3.5 4L8.5 6H6z" fill="white"/>
        </svg>
      </a>
      <a href={site.socialYoutube || DEFAULT_SETTINGS.socialYoutube} target="_blank" rel="noopener noreferrer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#121212"/>
          <rect x="4" y="7" width="16" height="10" rx="2.5" fill="white"/>
          <path d="M10 9.5l5 2.5-5 2.5V9.5z" fill="#121212"/>
        </svg>
      </a>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Desktop top-level link/button — Tailwind class string
// active   → full black, semibold
// inactive → 50% black, normal weight; hover → full black, semibold
const navLinkCls = (active: boolean) =>
  `text-[15px] leading-[22px] px-[10px] py-[11px] whitespace-nowrap transition-all duration-150 cursor-pointer
   ${active
     ? 'text-[#121212] font-semibold'
     : 'text-[rgba(18,18,18,0.5)] font-normal hover:text-[#121212] hover:font-semibold'}`;

// Dropdown item
const dropLinkCls = (active: boolean) =>
  `flex items-center h-[50px] px-[20px] text-[15px] leading-[22px] transition-all duration-150 no-underline
   ${active
     ? 'text-[#121212] font-semibold'
     : 'text-[rgba(18,18,18,0.5)] font-normal hover:text-[#121212] hover:font-semibold'}`;

// Mobile row link
const mobileRowCls = (active: boolean) =>
  `flex items-center h-[56px] px-[24px] text-[16px] no-underline border-b border-[rgba(18,18,18,0.06)] transition-colors duration-150
   ${active ? 'text-[#1769FF] font-semibold' : 'text-[#121212] font-normal'}`;

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const pathname = usePathname();

  // Desktop dropdown state
  const [guideOpen, setGuideOpen] = useState(false);
  const [clipOpen,  setClipOpen]  = useState(false);
  const [solOpen,   setSolOpen]   = useState(false);

  // Close-delay timers
  const guideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clipTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearT = (ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    if (ref.current) { clearTimeout(ref.current); ref.current = null; }
  };

  const openGuide  = () => { clearT(guideTimer); setGuideOpen(true);  setSolOpen(false); };
  const closeGuide = () => { guideTimer.current = setTimeout(() => { setGuideOpen(false); setClipOpen(false); }, 150); };
  const keepGuide  = () => clearT(guideTimer);

  const openClip   = () => { clearT(clipTimer); clearT(guideTimer); setClipOpen(true); };
  const closeClip  = () => { clipTimer.current = setTimeout(() => setClipOpen(false), 150); };
  const keepClip   = () => clearT(clipTimer);

  const openSol    = () => { clearT(solTimer); setSolOpen(true); setGuideOpen(false); setClipOpen(false); };
  const closeSol   = () => { solTimer.current = setTimeout(() => setSolOpen(false), 150); };
  const keepSol    = () => clearT(solTimer);

  // Mobile state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panel,      setPanel]      = useState<MobilePanel>('root');

  const isActive    = (path: string) => pathname === path;
  const closeMobile = () => { setMobileOpen(false); setPanel('root'); };

  // Whether any guide sub-page is active (so the trigger looks active)
  const guidePages = [
    '/hair-patch-vs-hair-system', '/clip-on-or-stick-on',
    '/clip-on-or-stick-on/clip-on-hair-system', '/clip-on-or-stick-on/stick-on-hair-system',
    '/will-my-hairline-look-real', '/stick-on-system-lifespan', '/clip-on-system-lifespan',
  ];
  const solPages = ['/clip-on-or-stick-on', '/scalp-micropigmentation', '/hair-transplant'];

  const guideActive = guideOpen || guidePages.includes(pathname);
  const solActive   = solOpen   || solPages.includes(pathname);

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white flex justify-center"
        style={{ boxShadow: '0px 1px 24px 0px rgba(0,0,0,0.08)' }}
      >
        <div className="w-full max-w-[1440px] h-[64px] md:h-[88px] flex items-center px-5 md:px-[60px] xl:px-[160px]">

          {/* Logo */}
          <Link href="/" className="relative w-[103px] h-[40px] flex-shrink-0 flex">
            <Image src="/assets/mkxm0e5x-jjniexs.png" alt="American Hairline" fill style={{ objectFit: 'contain' }} />
          </Link>

          {/* ── DESKTOP LINKS ────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0 ml-[48px] flex-1">

            {/* Home */}
            <Link href="/" className={navLinkCls(isActive('/'))}>
              Home
            </Link>

            {/* Confused? We'll Guide You */}
            <div className="relative" onMouseEnter={openGuide} onMouseLeave={closeGuide}>
              <button
                className={`${navLinkCls(guideActive)} flex items-center gap-1 bg-transparent border-none`}
              >
                Confused? We'll Guide You
                <ChevronDown
                  size={16}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: guideOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: guideActive ? 1 : 0.5 }}
                />
              </button>

              {guideOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-[16px] border border-[rgba(18,18,18,0.08)] py-[6px] z-[100]"
                  style={{ boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.08)', overflow: 'visible' }}
                  onMouseEnter={keepGuide}
                  onMouseLeave={closeGuide}
                >
                  <Link href="/hair-patch-vs-hair-system" className={dropLinkCls(isActive('/hair-patch-vs-hair-system'))}>
                    Hair patch vs Hair system
                  </Link>

                  {/* Clip-On or Stick-On — nested */}
                  <div className="relative" onMouseEnter={openClip} onMouseLeave={closeClip}>
                    <div className="flex items-center justify-between h-[50px] px-[20px] cursor-pointer bg-[rgba(243,244,246,0.6)]">
                      <Link href="/clip-on-or-stick-on"
                        className={`text-[15px] flex-1 no-underline transition-all duration-150 ${isActive('/clip-on-or-stick-on') ? 'text-[#121212] font-semibold' : 'text-[#121212] font-normal hover:font-semibold'}`}
                      >
                        Clip-On or Stick-On
                      </Link>
                      <ChevronRight size={16} className="text-[#121212] flex-shrink-0" />
                    </div>

                    {clipOpen && (
                      <div
                        className="absolute py-[6px] bg-white rounded-[16px] border border-[rgba(18,18,18,0.08)] z-[101]"
                        style={{ top: -6, left: '100%', marginLeft: 2, width: 280, boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.08)' }}
                        onMouseEnter={keepClip}
                        onMouseLeave={closeClip}
                      >
                        {[
                          { label: 'Clip-On Hair System',  href: '/clip-on-or-stick-on/clip-on-hair-system' },
                          { label: 'Stick-On Hair System', href: '/clip-on-or-stick-on/stick-on-hair-system' },
                        ].map(item => (
                          <Link key={item.href} href={item.href} className={dropLinkCls(isActive(item.href))}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {[
                    { label: 'Will my hairline look real?', href: '/will-my-hairline-look-real' },
                    { label: 'Stick-On System Lifespan',    href: '/stick-on-system-lifespan' },
                    { label: 'Clip-On System Lifespan',     href: '/clip-on-system-lifespan' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} className={dropLinkCls(isActive(item.href))}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions */}
            <div className="relative" onMouseEnter={openSol} onMouseLeave={closeSol}>
              <button
                className={`${navLinkCls(solActive)} flex items-center gap-1 bg-transparent border-none`}
              >
                Solutions
                <ChevronDown
                  size={16}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: solOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: solActive ? 1 : 0.5 }}
                />
              </button>

              {solOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-[16px] border border-[rgba(18,18,18,0.08)] py-[6px] z-[100]"
                  style={{ boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.08)' }}
                  onMouseEnter={keepSol}
                  onMouseLeave={closeSol}
                >
                  {[
                    { label: 'Hair Systems (No Surgery)',     href: '/clip-on-or-stick-on' },
                    { label: 'SMP (Scalp Micropigmentation)', href: '/scalp-micropigmentation' },
                    { label: 'Hair Transplant',               href: '/hair-transplant' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} className={dropLinkCls(isActive(item.href))}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            <Link href="/results" className={navLinkCls(isActive('/results'))}>
              Results
            </Link>

            {/* About Us */}
            <Link href="/about-us" className={navLinkCls(isActive('/about-us'))}>
              About Us
            </Link>

          </div>

          {/* ── DESKTOP CTA ──────────────────────────────────────────────── */}
          <div className="hidden lg:flex ml-auto flex-shrink-0">
            <Link href="/contact-us"
              className="flex items-center justify-center gap-2 h-[44px] px-[16px] rounded-[12px] text-white text-[15px] font-semibold tracking-[-0.1px] whitespace-nowrap transition-opacity hover:opacity-90 no-underline"
              style={{ background: 'linear-gradient(90deg,#4686FE,#1769FF)' }}
            >
              Book Now
              <Image src="/assets/mkxm0e5x-6dk90ej.svg" alt="" width={20} height={20} className="flex-shrink-0" />
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ─────────────────────────────────────────── */}
          <button
            className="lg:hidden ml-auto p-2 bg-transparent border-none cursor-pointer"
            onClick={() => { setMobileOpen(true); setPanel('root'); }}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#121212" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[64px] md:h-[88px]" />

      {/* ── MOBILE OVERLAY ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-5 h-[64px] border-b border-[rgba(18,18,18,0.06)] flex-shrink-0">
            {panel === 'root' ? (
              <Link href="/" onClick={closeMobile} className="relative w-[80px] h-[32px] flex">
                <Image src="/assets/mkxm0e5x-jjniexs.png" alt="American Hairline" fill style={{ objectFit: 'contain' }} />
              </Link>
            ) : (
              <button
                onClick={() => { if (panel === 'clip') setPanel('guide'); else setPanel('root'); }}
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
              >
                <ChevronLeft size={20} className="text-[#121212]" />
                <span className="text-[16px] font-semibold text-[#121212]">
                  {panel === 'guide' ? "Confused? We'll Guide You" : panel === 'clip' ? 'Clip-On or Stick-On' : 'Solutions'}
                </span>
              </button>
            )}
            <button onClick={closeMobile} className="bg-transparent border-none cursor-pointer p-1" aria-label="Close menu">
              <X size={24} className="text-[#121212]" />
            </button>
          </div>

          {/* ── ROOT PANEL ─────────────────────────────────────────────── */}
          {panel === 'root' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="pt-2">
                {[
                  { label: 'Home',     href: '/' },
                  { label: 'Results',  href: '/results' },
                  { label: 'About Us', href: '/about-us' },
                  { label: 'Careers',  href: '/career' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={closeMobile} className={mobileRowCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                ))}

                <button onClick={() => setPanel('guide')}
                  className="w-full flex items-center justify-between h-[56px] px-[24px] text-[16px] font-normal text-[#121212] bg-transparent border-none border-b border-[rgba(18,18,18,0.06)] cursor-pointer text-left"
                  style={{ borderBottom: '1px solid rgba(18,18,18,0.06)' }}
                >
                  Confused? We'll Guide You
                  <ChevronRight size={20} className="text-[#121212] flex-shrink-0" />
                </button>

                <button onClick={() => setPanel('solutions')}
                  className="w-full flex items-center justify-between h-[56px] px-[24px] text-[16px] font-normal text-[#121212] bg-transparent border-none border-b border-[rgba(18,18,18,0.06)] cursor-pointer text-left"
                  style={{ borderBottom: '1px solid rgba(18,18,18,0.06)' }}
                >
                  Solutions
                  <ChevronRight size={20} className="text-[#121212] flex-shrink-0" />
                </button>
              </div>

              <div className="px-[24px] pt-[24px] pb-[40px] flex flex-col gap-4">
                <Link href="/contact-us" onClick={closeMobile}
                  className="flex items-center justify-center gap-2 h-[52px] rounded-[12px] text-white text-[16px] font-semibold no-underline transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg,#4686FE,#1769FF)' }}
                >
                  Book Now
                  <Image src="/assets/mkxm0e5x-6dk90ej.svg" alt="" width={20} height={20} />
                </Link>
                <p className="text-[13px] text-[rgba(18,18,18,0.4)] m-0 tracking-[0.02em]">Get In Touch</p>
                <SocialIcons />
              </div>
            </div>
          )}

          {/* ── GUIDE PANEL ────────────────────────────────────────────── */}
          {panel === 'guide' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="pt-2">
                {[
                  { label: 'Hair patch vs Hair system',  href: '/hair-patch-vs-hair-system' },
                  { label: 'Will my hairline look real?', href: '/will-my-hairline-look-real' },
                  { label: 'Stick-On System Lifespan',   href: '/stick-on-system-lifespan' },
                  { label: 'Clip-On System Lifespan',    href: '/clip-on-system-lifespan' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={closeMobile} className={mobileRowCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => setPanel('clip')}
                  className="w-full flex items-center justify-between h-[56px] px-[24px] text-[16px] font-normal text-[#121212] bg-transparent border-none cursor-pointer text-left"
                  style={{ borderBottom: '1px solid rgba(18,18,18,0.06)' }}
                >
                  Clip-On or Stick-On
                  <ChevronRight size={20} className="text-[#121212] flex-shrink-0" />
                </button>
              </div>
              <div className="px-[24px] pt-[24px] pb-[40px] flex flex-col gap-4">
                <p className="text-[13px] text-[rgba(18,18,18,0.4)] m-0">Get In Touch</p>
                <SocialIcons />
              </div>
            </div>
          )}

          {/* ── CLIP PANEL ─────────────────────────────────────────────── */}
          {panel === 'clip' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="pt-2">
                {[
                  { label: 'Clip-On Hair System',  href: '/clip-on-or-stick-on/clip-on-hair-system' },
                  { label: 'Stick-On Hair System', href: '/clip-on-or-stick-on/stick-on-hair-system' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={closeMobile} className={mobileRowCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-[24px] pt-[24px] pb-[40px] flex flex-col gap-4">
                <p className="text-[13px] text-[rgba(18,18,18,0.4)] m-0">Get In Touch</p>
                <SocialIcons />
              </div>
            </div>
          )}

          {/* ── SOLUTIONS PANEL ────────────────────────────────────────── */}
          {panel === 'solutions' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="pt-2">
                {[
                  { label: 'Hair Systems (No Surgery)',     href: '/clip-on-or-stick-on' },
                  { label: 'SMP (Scalp Micropigmentation)', href: '/scalp-micropigmentation' },
                  { label: 'Hair Transplant',               href: '/hair-transplant' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={closeMobile} className={mobileRowCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-[24px] pt-[24px] pb-[40px] flex flex-col gap-4">
                <p className="text-[13px] text-[rgba(18,18,18,0.4)] m-0">Get In Touch</p>
                <SocialIcons />
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};
