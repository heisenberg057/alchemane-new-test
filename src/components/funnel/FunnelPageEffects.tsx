'use client';

import { useEffect } from 'react';

const DESKTOP_MIN = 1024;

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.innerWidth >= DESKTOP_MIN;
}

function getSlideStep(slider: HTMLElement, slide: HTMLElement) {
  const gapValue = getComputedStyle(slider).gap || '16px';
  const gap = Number.parseFloat(gapValue.split(' ')[0] || '16') || 16;
  return slide.offsetWidth + gap;
}

function stopCarouselEvent(event?: Event) {
  event?.preventDefault();
  event?.stopPropagation();
}

type ScrollCarouselConfig = {
  slider: HTMLElement;
  slides: HTMLElement[];
  prevBtn?: HTMLElement | null;
  nextBtn?: HTMLElement | null;
  dots?: HTMLElement[];
  activeDotColor?: string;
  inactiveDotColor?: string;
};

function bindScrollCarousel({
  slider,
  slides,
  prevBtn,
  nextBtn,
  dots,
  activeDotColor = '#1E1F21',
  inactiveDotColor = '#ccc',
}: ScrollCarouselConfig) {
  if (slides.length < 2) return () => {};

  let index = 0;

  const updateDots = (activeIndex: number) => {
    dots?.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.style.backgroundColor = active ? activeDotColor : inactiveDotColor;
      dot.classList.toggle('active', active);
    });
  };

  const updateArrows = (activeIndex: number) => {
    if (!prevBtn || !nextBtn) return;
    if (isDesktopViewport()) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      return;
    }
    prevBtn.style.display = activeIndex <= 0 ? 'none' : 'flex';
    nextBtn.style.display =
      activeIndex >= slides.length - 1 ? 'none' : 'flex';
  };

  const syncFromScroll = () => {
    const step = getSlideStep(slider, slides[0]);
    if (!step) return;
    index = Math.min(
      slides.length - 1,
      Math.max(0, Math.round(slider.scrollLeft / step))
    );
    updateDots(index);
    updateArrows(index);
  };

  const scrollToIndex = (nextIndex: number) => {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    const slide = slides[index];
    if (!slide) return;

    slider.scrollTo({
      left: Math.max(0, slide.offsetLeft - slider.offsetLeft),
      behavior: 'smooth',
    });
    updateDots(index);
    updateArrows(index);
  };

  const onPrev = (event: Event) => {
    stopCarouselEvent(event);
    scrollToIndex(index - 1);
  };

  const onNext = (event: Event) => {
    stopCarouselEvent(event);
    scrollToIndex(index + 1);
  };

  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);
  slider.addEventListener('scroll', syncFromScroll, { passive: true });

  requestAnimationFrame(() => {
    syncFromScroll();
    updateArrows(index);
  });

  return () => {
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
    slider.removeEventListener('scroll', syncFromScroll);
  };
}

const MOBILE_CAROUSEL_ARROW_IDS = [
  'hero-prev-arrow-main',
  'hero-next-arrow-main',
  'video-prev-new',
  'video-next-new',
  'video-prev-arrow',
  'video-next-arrow',
  'testi-prev-arrow-new',
  'testi-next-arrow-new',
  'why-prev-arrow-main',
  'why-next-arrow-main',
];

/**
 * Replaces FlexiFunnel inline scripts removed during HTML sanitization.
 */
export function FunnelPageEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const syncStickyVariant = () => {
      const desktop = document.getElementById('sticky-desktop');
      const mobile = document.getElementById('sticky-mobile');
      if (!desktop && !mobile) return;
      const wide = isDesktopViewport();
      if (desktop) desktop.style.display = wide ? 'block' : 'none';
      if (mobile) mobile.style.display = wide ? 'none' : 'block';
    };

    syncStickyVariant();
    window.addEventListener('resize', syncStickyVariant, { passive: true });
    cleanups.push(() => window.removeEventListener('resize', syncStickyVariant));

    const sticky = document.getElementById('sticky-cta-bar');
    if (sticky) {
      const onScroll = () => {
        sticky.style.transform =
          window.scrollY > 280 ? 'translateY(0)' : 'translateY(100%)';
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }

    const hourIds = ['hours-d', 'hours-m'];
    const minIds = ['minutes-d', 'minutes-m'];
    const secIds = ['seconds-d', 'seconds-m'];
    const end = Date.now() + 10 * 60 * 60 * 1000;
    const pad = (n: number) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      hourIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pad(h);
      });
      minIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pad(m);
      });
      secIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pad(s);
      });
    };

    if (
      hourIds.some((id) => document.getElementById(id)) ||
      minIds.some((id) => document.getElementById(id))
    ) {
      tick();
      const interval = window.setInterval(tick, 1000);
      cleanups.push(() => window.clearInterval(interval));
    }

    const rotateBadgeCarousel = (
      containerId: string,
      itemSelector: string
    ) => {
      const container = document.getElementById(containerId);
      if (!container) return undefined;
      const items = container.querySelectorAll<HTMLElement>(itemSelector);
      if (items.length < 2) return undefined;
      let index = 0;
      const step = () => {
        index = (index + 1) % items.length;
        container.style.transform = `translateY(-${index * 28}px)`;
      };
      const interval = window.setInterval(step, 2800);
      return () => window.clearInterval(interval);
    };

    const badgeCleanupD = rotateBadgeCarousel(
      'badge-carousel-desktop',
      '.trust-badge-d'
    );
    const badgeCleanupM = rotateBadgeCarousel(
      'badge-carousel-mobile',
      '.trust-badge-m'
    );
    if (badgeCleanupD) cleanups.push(badgeCleanupD);
    if (badgeCleanupM) cleanups.push(badgeCleanupM);

    const initFaqSections = () => {
      document.querySelectorAll<HTMLElement>('#faq-container').forEach((container) => {
        const sectionRoot =
          container.closest<HTMLElement>('.funnel-section-inner > div') ??
          container.parentElement;
        const faqItems = Array.from(container.querySelectorAll<HTMLElement>('.faq-item'));
        const tabConsultation =
          sectionRoot?.querySelector<HTMLElement>('#tab-consultation') ?? null;
        const tabSystem = sectionRoot?.querySelector<HTMLElement>('#tab-system') ?? null;
        if (!faqItems.length) return;

        const setOpen = (item: HTMLElement, open: boolean) => {
          const answer = item.querySelector<HTMLElement>('.faq-answer');
          const icon = item.querySelector<HTMLElement>('.faq-icon');
          const trigger = item.querySelector<HTMLElement>(
            'div[style*="cursor:pointer"], .faq-question'
          );

          if (answer) answer.style.display = open ? 'block' : 'none';
          if (icon) icon.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
          if (trigger) trigger.setAttribute('aria-expanded', String(open));
          item.classList.toggle('is-open', open);
        };

        const closeAll = () => {
          faqItems.forEach((item) => setOpen(item, false));
        };

        faqItems.forEach((item) => {
          const trigger = item.querySelector<HTMLElement>(
            'div[style*="cursor:pointer"], .faq-question'
          );
          if (!trigger) return;

          trigger.setAttribute('role', 'button');
          trigger.setAttribute('tabindex', '0');
          setOpen(item, false);

          const toggle = (event: Event) => {
            stopCarouselEvent(event);
            const isOpen = item.classList.contains('is-open');
            closeAll();
            setOpen(item, !isOpen);
          };

          const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            toggle(event);
          };

          trigger.addEventListener('click', toggle);
          trigger.addEventListener('keydown', onKeyDown);
          cleanups.push(() => {
            trigger.removeEventListener('click', toggle);
            trigger.removeEventListener('keydown', onKeyDown);
          });
        });

        if (!tabConsultation || !tabSystem) return;

        const showTab = (which: 'consultation' | 'system') => {
          closeAll();
          faqItems.forEach((el) => {
            const isConsultation = el.classList.contains('consultation');
            const isSystem = el.classList.contains('system');
            if (which === 'consultation') {
              el.style.display = isConsultation ? 'block' : 'none';
            } else {
              el.style.display = isSystem ? 'block' : 'none';
            }
          });
        const active = {
          bg: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)',
          color: '#fff',
          border: 'none',
          shadow: '0 2px 8px rgba(23, 105, 255, 0.25)',
        };
        const idle = {
          bg: '#fff',
          color: '#191919',
          border: '1px solid #e0e0e0',
          shadow: 'none',
        };
        const applyTabStyle = (
          tab: HTMLElement,
          isActive: boolean
        ) => {
          const style = isActive ? active : idle;
          tab.style.background = style.bg;
          tab.style.color = style.color;
          tab.style.border = style.border;
          tab.style.boxShadow = style.shadow;
        };
        applyTabStyle(tabConsultation, which === 'consultation');
        applyTabStyle(tabSystem, which === 'system');
      };
      const onConsultation = () => showTab('consultation');
      const onSystem = () => showTab('system');
      tabConsultation.addEventListener('click', onConsultation);
      tabSystem.addEventListener('click', onSystem);
      showTab('consultation');
      cleanups.push(() => {
        tabConsultation.removeEventListener('click', onConsultation);
        tabSystem.removeEventListener('click', onSystem);
      });
      });
    };

    initFaqSections();

    const syncCarouselControlsForViewport = () => {
      const desktop = isDesktopViewport();
      document
        .querySelectorAll<HTMLElement>(
          '#hero-prev-arrow-main, #hero-next-arrow-main, #video-prev-arrow, #video-next-arrow, [id*="prev-arrow"], [id*="next-arrow"]'
        )
        .forEach((el) => {
          const keepVisible =
            el.id === 'video-prev-new' ||
            el.id === 'video-next-new' ||
            el.id === 'testi-prev-arrow-new' ||
            el.id === 'testi-next-arrow-new' ||
            el.id === 'why-prev-arrow-main' ||
            el.id === 'why-next-arrow-main' ||
            el.classList.contains('funnel-location__arrow') ||
            el.classList.contains('location-arrow-left') ||
            el.classList.contains('location-arrow-right') ||
            el.classList.contains('location-arrow-left-main') ||
            el.classList.contains('location-arrow-right-main');

          if (desktop) {
            if (
              el.id === 'hero-prev-arrow-main' ||
              el.id === 'hero-next-arrow-main'
            ) {
              el.style.display = 'none';
            } else if (
              !keepVisible &&
              (el.id.includes('prev-arrow') || el.id.includes('next-arrow'))
            ) {
              el.style.display = 'none';
            }
            return;
          }

          if (MOBILE_CAROUSEL_ARROW_IDS.includes(el.id) || keepVisible) {
            el.style.removeProperty('display');
          }
        });
    };
    syncCarouselControlsForViewport();
    window.addEventListener('resize', syncCarouselControlsForViewport, {
      passive: true,
    });
    cleanups.push(() =>
      window.removeEventListener('resize', syncCarouselControlsForViewport)
    );

    const initHeroCarousel = () => {
      const heroContainer = document.querySelector<HTMLElement>(
        '.hero-image-container-main'
      );
      const prev = document.getElementById('hero-prev-arrow-main');
      const next = document.getElementById('hero-next-arrow-main');
      if (!heroContainer || !prev || !next) return;

      const slides = heroContainer.querySelectorAll<HTMLElement>(
        '.hero-image-slide-main'
      );
      if (slides.length < 2) return;

      const cleanup = bindScrollCarousel({
        slider: heroContainer,
        slides: Array.from(slides),
        prevBtn: prev,
        nextBtn: next,
      });
      cleanups.push(cleanup);
    };

    initHeroCarousel();

    const initLegacyVideoSliders = () => {
      document.querySelectorAll<HTMLElement>('[id="video-slider"]').forEach((slider) => {
        const root =
          slider.closest<HTMLElement>('section, [id*="section"]') ||
          slider.parentElement;
        if (!root) return;

        const prevBtn = root.querySelector<HTMLElement>('[id="video-prev-arrow"]');
        const nextBtn = root.querySelector<HTMLElement>('[id="video-next-arrow"]');
        const slides = slider.querySelectorAll<HTMLElement>('.video-slide');
        const dots = root.querySelectorAll<HTMLElement>('.dot');

        const cleanup = bindScrollCarousel({
          slider,
          slides: Array.from(slides),
          prevBtn,
          nextBtn,
          dots: Array.from(dots),
          activeDotColor: '#1769FF',
          inactiveDotColor: '#D1D5DB',
        });
        cleanups.push(cleanup);
      });
    };

    initLegacyVideoSliders();
    const initThinnestVideoCarousels = () => {
      document.querySelectorAll<HTMLElement>('.funnel-html-section').forEach((sectionEl) => {
        const inner = sectionEl.querySelector<HTMLElement>('.funnel-section-inner');
        if (!inner) return;

        const slider = inner.querySelector<HTMLElement>('#video-slider-new');
        const prevBtn = inner.querySelector<HTMLElement>('#video-prev-new');
        const nextBtn = inner.querySelector<HTMLElement>('#video-next-new');
        const dots = inner.querySelectorAll<HTMLElement>('.vdot-new');
        if (!slider || !prevBtn || !nextBtn) return;

        const slides = slider.querySelectorAll<HTMLElement>('.video-slide-new');
        const cleanup = bindScrollCarousel({
          slider,
          slides: Array.from(slides),
          prevBtn,
          nextBtn,
          dots: Array.from(dots),
        });
        cleanups.push(cleanup);
      });
    };

    initThinnestVideoCarousels();

    const initTestimonialCarousels = () => {
      document.querySelectorAll<HTMLElement>('.testi-carousel-new').forEach((carouselEl) => {
        const slider = carouselEl.querySelector<HTMLElement>('.testi-container-new');
        const prevBtn = carouselEl.querySelector<HTMLElement>('#testi-prev-arrow-new');
        const nextBtn = carouselEl.querySelector<HTMLElement>('#testi-next-arrow-new');
        const dots = carouselEl.querySelectorAll<HTMLElement>('.tdot-new');
        if (!slider || !prevBtn || !nextBtn) return;

        if (prevBtn.parentElement === slider) {
          carouselEl.appendChild(prevBtn);
        }

        if (nextBtn.parentElement === slider) {
          carouselEl.appendChild(nextBtn);
        }

        const slides = slider.querySelectorAll<HTMLElement>('.testimonial-card-new');
        const cleanup = bindScrollCarousel({
          slider,
          slides: Array.from(slides),
          prevBtn,
          nextBtn,
          dots: Array.from(dots),
          inactiveDotColor: '#E6E6E6',
        });
        cleanups.push(cleanup);

        dots.forEach((dot, dotIndex) => {
          const onDot = (event: Event) => {
            stopCarouselEvent(event);
            const slide = slides[dotIndex];
            if (!slide) return;
            slider.scrollTo({
              left: Math.max(0, slide.offsetLeft - slider.offsetLeft),
              behavior: 'smooth',
            });
          };
          dot.addEventListener('click', onDot);
          cleanups.push(() => dot.removeEventListener('click', onDot));
        });
      });
    };

    initTestimonialCarousels();

    const initBenefitAccordions = () => {
      document.querySelectorAll<HTMLElement>('#benefits-container').forEach((container) => {
        const items = Array.from(container.querySelectorAll<HTMLElement>('.benefit-item'));
        if (!items.length) return;

        const setOpen = (item: HTMLElement, open: boolean) => {
          const answer = item.querySelector<HTMLElement>('.benefit-answer');
          const arrow = item.querySelector<HTMLElement>('.benefit-arrow');
          const trigger = item.firstElementChild as HTMLElement | null;

          if (answer) {
            answer.style.display = open ? 'block' : 'none';
          }
          if (arrow) {
            arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
          }
          if (trigger) {
            trigger.setAttribute('aria-expanded', String(open));
          }
          item.classList.toggle('is-open', open);
        };

        items.forEach((item) => {
          const trigger = item.firstElementChild as HTMLElement | null;
          if (!trigger) return;

          const answer = item.querySelector<HTMLElement>('.benefit-answer');
          const open = answer ? getComputedStyle(answer).display !== 'none' : false;

          trigger.setAttribute('role', 'button');
          trigger.setAttribute('tabindex', '0');
          setOpen(item, open);

          const toggle = (event: Event) => {
            stopCarouselEvent(event);
            const isOpen = item.classList.contains('is-open');

            items.forEach((otherItem) => setOpen(otherItem, false));
            setOpen(item, !isOpen);
          };

          const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            toggle(event);
          };

          trigger.addEventListener('click', toggle);
          trigger.addEventListener('keydown', onKeyDown);
          cleanups.push(() => {
            trigger.removeEventListener('click', toggle);
            trigger.removeEventListener('keydown', onKeyDown);
          });
        });
      });
    };

    initBenefitAccordions();

    const initWhyChooseCarousels = () => {
      document.querySelectorAll<HTMLElement>('.why-carousel-main').forEach((carouselEl) => {
        const slider = carouselEl.querySelector<HTMLElement>('.why-container-main');
        const prevBtn = carouselEl.querySelector<HTMLElement>('#why-prev-arrow-main');
        const nextBtn = carouselEl.querySelector<HTMLElement>('#why-next-arrow-main');
        const dots = carouselEl.querySelectorAll<HTMLElement>('.why-dot-main');
        if (!slider || !prevBtn || !nextBtn) return;

        const slides = slider.querySelectorAll<HTMLElement>('.why-card-main');
        const cleanup = bindScrollCarousel({
          slider,
          slides: Array.from(slides),
          prevBtn,
          nextBtn,
          dots: Array.from(dots),
          inactiveDotColor: '#E6E6E6',
        });
        cleanups.push(cleanup);

        dots.forEach((dot, dotIndex) => {
          const onDot = (event: Event) => {
            stopCarouselEvent(event);
            const slide = slides[dotIndex];
            if (!slide) return;
            slider.scrollTo({
              left: Math.max(0, slide.offsetLeft - slider.offsetLeft),
              behavior: 'smooth',
            });
          };
          dot.addEventListener('click', onDot);
          cleanups.push(() => dot.removeEventListener('click', onDot));
        });
      });
    };

    initWhyChooseCarousels();

    const initLocationCarousels = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        '.funnel-location-section, .location-section, .location-section-main'
      );

      sections.forEach((section) => {
        const track = section.querySelector<HTMLElement>(
          '.funnel-location__track, .location-carousel-track, .location-container-main'
        );
        let prevBtn = section.querySelector<HTMLElement>(
          '.funnel-location__arrow--prev, .location-arrow-left, .location-arrow-left-main'
        );
        let nextBtn = section.querySelector<HTMLElement>(
          '.funnel-location__arrow--next, .location-arrow-right, .location-arrow-right-main'
        );
        const dotsHost = section.querySelector<HTMLElement>(
          '.funnel-location__dots, .location-carousel-dots, .location-dots-main'
        );
        if (!track) return;

        const createLocationArrow = (direction: 'prev' | 'next') => {
          const arrow = document.createElement('button');
          arrow.type = 'button';
          arrow.className =
            direction === 'prev'
              ? 'location-arrow-left location-arrow-generated'
              : 'location-arrow-right location-arrow-generated';
          arrow.setAttribute(
            'aria-label',
            direction === 'prev' ? 'Previous location image' : 'Next location image'
          );
          arrow.innerHTML =
            direction === 'prev'
              ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M14 18L8 12L14 6" stroke="#1769FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
              : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M10 18L16 12L10 6" stroke="#1769FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          return arrow;
        };

        if (prevBtn && prevBtn.parentElement === track) {
          track.parentElement?.appendChild(prevBtn);
        }

        if (nextBtn && nextBtn.parentElement === track) {
          track.parentElement?.appendChild(nextBtn);
        }

        if (!prevBtn) {
          prevBtn = createLocationArrow('prev');
          track.parentElement?.appendChild(prevBtn);
        }

        if (!nextBtn) {
          nextBtn = createLocationArrow('next');
          track.parentElement?.appendChild(nextBtn);
        }

        const slides = track.querySelectorAll<HTMLElement>(
          '.funnel-location__slide, .location-carousel-slide, .location-slide-main'
        );
        if (slides.length < 2) return;

        const desktopSlideStep = 320 + 24;
        const maxDesktopIndex = Math.max(0, slides.length - 3);
        let index = 0;
        let mode: 'mobile' | 'desktop' | null = null;
        let unbindMobile = () => {};

        const ensureDots = () => {
          if (!dotsHost) return [] as HTMLElement[];
          if (!dotsHost.children.length) {
            slides.forEach((_, dotIndex) => {
              const dot = document.createElement('span');
              dot.className = dotsHost.classList.contains('location-dots-main')
                ? 'location-dot-main'
                : 'location-carousel-dot';
              if (dotIndex === 0) dot.classList.add('active');
              dotsHost.appendChild(dot);
            });
          }
          return Array.from(
            dotsHost.querySelectorAll<HTMLElement>(
              '.location-carousel-dot, .location-dot-main'
            )
          );
        };

        const dots = ensureDots();

        const updateDots = (activeIndex: number) => {
          dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === activeIndex);
            dot.style.backgroundColor =
              dotIndex === activeIndex ? '#1E1F21' : '#D9D9D9';
          });
        };

        const applyDesktop = () => {
          track.style.transform = `translateX(-${index * desktopSlideStep}px)`;
          updateDots(index);
        };

        const mount = () => {
          const desktop = isDesktopViewport();
          if ((desktop && mode === 'desktop') || (!desktop && mode === 'mobile')) {
            return;
          }

          unbindMobile();
          unbindMobile = () => {};
          mode = desktop ? 'desktop' : 'mobile';

          if (desktop) {
            track.style.transform = '';
            index = Math.min(index, maxDesktopIndex);
            applyDesktop();
            return;
          }

          track.style.transform = '';
          unbindMobile = bindScrollCarousel({
            slider: track,
            slides: Array.from(slides),
            prevBtn,
            nextBtn,
            dots,
            activeDotColor: '#1E1F21',
            inactiveDotColor: '#D9D9D9',
          });
        };

        const onPrevDesktop = (event: Event) => {
          if (!isDesktopViewport()) return;
          stopCarouselEvent(event);
          event.stopImmediatePropagation();
          index = Math.max(0, index - 1);
          applyDesktop();
        };

        const onNextDesktop = (event: Event) => {
          if (!isDesktopViewport()) return;
          stopCarouselEvent(event);
          event.stopImmediatePropagation();
          index = Math.min(maxDesktopIndex, index + 1);
          applyDesktop();
        };

        const onResize = () => {
          const wasDesktop = mode === 'desktop';
          const nowDesktop = isDesktopViewport();
          if (wasDesktop !== nowDesktop) {
            mode = null;
          }
          mount();
        };

        prevBtn.addEventListener('click', onPrevDesktop, true);
        nextBtn.addEventListener('click', onNextDesktop, true);
        window.addEventListener('resize', onResize, { passive: true });
        mount();

        dots.forEach((dot, dotIndex) => {
          const onDot = (event: Event) => {
            stopCarouselEvent(event);
            if (isDesktopViewport()) {
              index = Math.min(dotIndex, maxDesktopIndex);
              applyDesktop();
              return;
            }
            const slide = slides[dotIndex];
            if (!slide) return;
            track.scrollTo({
              left: Math.max(0, slide.offsetLeft - track.offsetLeft),
              behavior: 'smooth',
            });
          };
          dot.addEventListener('click', onDot, true);
          cleanups.push(() => dot.removeEventListener('click', onDot, true));
        });

        cleanups.push(() => {
          prevBtn.removeEventListener('click', onPrevDesktop, true);
          nextBtn.removeEventListener('click', onNextDesktop, true);
          window.removeEventListener('resize', onResize);
          unbindMobile();
          track.style.transform = '';
        });
      });
    };

    initLocationCarousels();

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
