'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Layers, Sticker } from 'lucide-react';
import { MediaImage } from '@/components/media/MediaImage';
import { useReveal } from '../HeroSecret/hooks';
import { methods, methodsAction, methodsTitle, type Method } from './content';

const icons: Record<Method['icon'], typeof Layers> = {
  sticker: Sticker,
  clips: Layers,
};

export default function Methods() {
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState(0);
  const [shownMedia, setShownMedia] = useState(0);

  const toggle = (index: number) => {
    setOpen((current) => (current === index ? -1 : index));
    setShownMedia(index);
  };

  return (
    <section className="ahlV2Methods methods" aria-labelledby="methods-title">
      <div
        className="methods__in wrap"
        data-shown={shown ? 'true' : 'false'}
        ref={revealRef}
      >
        <div className="methods__col">
          <h2 className="methods__title" id="methods-title">
            {methodsTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <ul className="methods__list">
            {methods.map((method, i) => {
              const Icon = icons[method.icon];
              const expanded = i === open;

              return (
                <li
                  className="methods__item"
                  data-open={expanded ? 'true' : 'false'}
                  key={method.title}
                >
                  <h3>
                    <button
                      type="button"
                      className="methods__head"
                      onClick={() => toggle(i)}
                      aria-expanded={expanded}
                    >
                      <Icon size={19} strokeWidth={2} aria-hidden="true" />
                      <span>{method.title}</span>
                      <ChevronDown
                        className="methods__chevron"
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <div className="methods__body">
                    <div className="methods__bodyIn">
                      <p>{method.body}</p>
                      <a className="methods__cta" href={method.href}>
                        {methodsAction}
                        <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="methods__media">
          {methods.map((method, i) => {
            const current = i === shownMedia;
            return (
              <MediaImage
                key={method.image}
                src={method.image}
                alt={current ? method.alt : ''}
                data-current={current ? 'true' : 'false'}
                aria-hidden={current ? undefined : true}
                width={1400}
                height={1000}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
