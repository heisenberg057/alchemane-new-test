'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { clientStories, clientStoriesTitle, type ClientStory } from './content';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';

function StoryCard({
  story,
  playing,
  onPlay,
}: {
  story: ClientStory;
  playing: boolean;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playable = Boolean(story.gumletId) || story.src !== '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || story.gumletId) return;
    if (playing) {
      void video.play().catch(() => {});
      return;
    }
    video.pause();
    video.currentTime = 0;
  }, [playing, story.gumletId]);

  const media = playing && story.gumletId ? (
    <div className="voices__media">
      <iframe
        className="voices__video"
        src={gumletEmbedUrl(story.gumletId)}
        title={`${story.name} story`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        loading="lazy"
        style={{ border: 'none', width: '100%', height: '100%', minHeight: 280 }}
      />
    </div>
  ) : playing && story.src ? (
    <div className="voices__media">
      <video
        ref={videoRef}
        className="voices__video"
        src={story.src}
        poster={story.poster}
        controls
        autoPlay
        playsInline
        preload="none"
      />
    </div>
  ) : (
    <>
      <MediaImage
        src={story.poster}
        alt={story.alt}
        width={1200}
        height={1500}
        sizes="(max-width: 900px) 80vw, 28vw"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <span className="voices__tag voices__tag--before">Before</span>
      <span className="voices__tag voices__tag--after">After</span>
      <p className="voices__quote">“{story.quote}”</p>
      {playable ? (
        <span className="voices__play">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" />
          </svg>
        </span>
      ) : null}
    </>
  );

  return (
    <article className="voices__item">
      {playable && !playing ? (
        <button
          type="button"
          className="voices__media voices__media--playable"
          onClick={onPlay}
        >
          {media}
          <span className="sr-only">Play {story.name}’s story</span>
        </button>
      ) : playing ? (
        media
      ) : (
        <figure className="voices__media">{media}</figure>
      )}
      <h3 className="voices__name">{story.name}</h3>
    </article>
  );
}

export default function ClientStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const [distance, setDistance] = useState(0);
  const [playingName, setPlayingName] = useState<string | null>(null);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const pinned = window.matchMedia('(min-width: 901px)').matches && !still;
      setDistance(pinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [still]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const pinned = distance > 0;

  return (
    <section
      className={`ahlV2Voices voices${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="voices-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="voices__pin">
        <motion.div
          className="voices__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="voices__intro">
            <h2 className="voices__title" id="voices-title">
              {clientStoriesTitle.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </h2>
            <a className="voices__link" href="/results">
              See more client stories
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {clientStories.map((story) => (
            <StoryCard
              story={story}
              key={story.name}
              playing={playingName === story.name}
              onPlay={() => setPlayingName(story.name)}
            />
          ))}

          <div className="voices__outro">
            <p className="voices__outroCopy">
              Every one of them was asked the same question afterwards: could anyone tell?
            </p>
            <a className="voices__link" href="#contact-form">
              Discuss with a consultant
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
