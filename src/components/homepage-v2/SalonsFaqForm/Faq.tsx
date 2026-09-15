'use client';

import { useState, type CSSProperties } from 'react';
import { ArrowUpRight, Plus, Star, X } from 'lucide-react';
import { useReveal } from '../HeroSecret/hooks';
import { faqCta, faqGroups, faqRating, faqTitle } from './content';

export default function Faq() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number[]>(() => faqGroups.map(() => 0));

  const group = faqGroups[tab];
  const openRow = open[tab];

  const toggle = (index: number) => {
    setOpen((prev) =>
      prev.map((value, i) => (i === tab ? (value === index ? -1 : index) : value))
    );
  };

  return (
    <section className="ahlV2Close faq" aria-labelledby="faq-title">
      <div className="faq__in wrap" data-shown={shown ? 'true' : 'false'} ref={ref}>
        <header className="faq__head">
          <h2 className="faq__title" id="faq-title">
            {faqTitle}
          </h2>

          <p className="faq__rating">
            <span className="faq__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} strokeWidth={0} fill="currentColor" />
              ))}
            </span>
            <span className="faq__score">{faqRating.score}</span>
            <span className="faq__reviews">{faqRating.label}</span>
          </p>

          <div className="faq__tabs" role="tablist" aria-label="Question topics">
            {faqGroups.map((g, i) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`faq-tab-${g.id}`}
                aria-selected={i === tab}
                aria-controls={`faq-panel-${g.id}`}
                className="faq__tab"
                data-active={i === tab ? 'true' : 'false'}
                onClick={() => setTab(i)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </header>

        <div
          className="faq__panel"
          role="tabpanel"
          id={`faq-panel-${group.id}`}
          aria-labelledby={`faq-tab-${group.id}`}
        >
          <ul className="faq__list">
            {group.items
              .filter((item) => !item.hidden)
              .map((item, i) => {
                const expanded = i === openRow;
                return (
                  <li
                    className="faq__row"
                    data-open={expanded ? 'true' : 'false'}
                    key={item.q}
                    style={{ '--i': i } as CSSProperties}
                  >
                    <h3>
                      <button
                        type="button"
                        className="faq__q"
                        onClick={() => toggle(i)}
                        aria-expanded={expanded}
                      >
                        <span>{item.q}</span>
                        {expanded ? (
                          <X size={17} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <Plus size={17} strokeWidth={2} aria-hidden="true" />
                        )}
                      </button>
                    </h3>

                    <div className="faq__a">
                      <div className="faq__aIn">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>

          <div className="faq__cta">
            <h3>{faqCta.title}</h3>
            <p>{faqCta.body}</p>
            <a className="btn btn--sm faq__ctaBtn" href={faqCta.href}>
              {faqCta.action}
              <ArrowUpRight
                className="btn__arrow"
                size={15}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
