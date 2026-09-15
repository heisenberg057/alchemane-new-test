'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Users, ArrowUpRight } from 'lucide-react';
import { CAREER_OFFICE_ASSETS } from './careerOfficeAssets';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CAREER_HERO_VIDEOS = [
  {
    id: 'career-hero-video-1',
    title: 'American Hairline office culture video 1',
    embedSrc: 'https://play.gumlet.io/embed/69e785584fc3fe661c973174?background=false&autoplay=false&loop=false&disable_player_controls=false',
  },
  {
    id: 'career-hero-video-2',
    title: 'American Hairline office culture video 2',
    embedSrc: 'https://play.gumlet.io/embed/69e78558ed3ab5a354345f09?background=false&autoplay=false&loop=false&disable_player_controls=false',
  },
  {
    id: 'career-hero-video-3',
    title: 'American Hairline office culture video 3',
    embedSrc: 'https://play.gumlet.io/embed/69e78558ed3ab5a354345f0e?background=false&autoplay=false&loop=false&disable_player_controls=false',
  },
  {
    id: 'career-hero-video-4',
    title: 'American Hairline office culture video 4',
    embedSrc: 'https://play.gumlet.io/embed/69e78558aed638b82a985eb9?background=false&autoplay=false&loop=false&disable_player_controls=false',
  },
];

const BENEFITS = [
  { iconType: 'users',  title: 'Inclusive and Diverse Culture',  desc: 'We value individuality and ensure every voice is heard.' },
  { iconType: 'cake',   title: 'Birthday Celebrations',           desc: 'Celebrate with cake and your team to make your day special!' },
  { iconType: 'rocket', title: 'Growth Opportunities',            desc: 'We provide resources and support for your continuous development.' },
  { iconType: 'chart',  title: 'Performance-Based',               desc: 'Your hard work is recognized and rewarded here.' },
  { iconType: 'party',  title: 'Fun Fridays',                     desc: 'End the week with some fun and team bonding!' },
];

const JOBS = [
  { title: 'Social Media Executive',       desc: "We're looking for a mid-level social media executive to join our team.",   location: 'Mumbai', type: 'Full-Time' },
  { title: 'Senior Video Editor',          desc: "We're looking for a senior-level video editor to join our team.",           location: 'Mumbai', type: 'Full-Time' },
  { title: 'AI Developer Intern',          desc: "We're looking for a AI developer intern to join our team.",                 location: 'Mumbai', type: 'Full-Time' },
  { title: 'Social Media Executive',       desc: "We're looking for a mid-level social media executive to join our team.",   location: 'Mumbai', type: 'Full-Time' },
  { title: 'Social Media Executive',       desc: "We're looking for a mid-level social media executive to join our team.",   location: 'Mumbai', type: 'Full-Time' },
  { title: 'Talent Acquisition Executive', desc: "We're looking for a senior talent acquisition executive to join our team.", location: 'Mumbai', type: 'Full-Time' },
];

// ─── BENEFIT ICONS ────────────────────────────────────────────────────────────

function IconUsers({ size = 28 }: { size?: number }) {
  const iconId = React.useId();
  const gradientId = `${iconId}-career-users-icon-gradient`;
  const clipId = `${iconId}-career-users-icon-clip`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 56 56" fill="none">
      <g clipPath={`url(#${clipId})`}>
        <path d="M28 29.7647C32.7674 29.7647 37.0891 31.3319 40.2553 33.5259C43.2679 35.6135 45.8182 38.714 45.8182 42.0503C45.8182 43.8826 45.0327 45.3993 43.7933 46.5291C42.6272 47.5923 41.1048 48.2815 39.5368 48.753C36.4025 49.6957 32.2771 50 28 50C23.7229 50 19.5975 49.6957 16.4632 48.753C14.8952 48.2815 13.3727 47.5923 12.2066 46.5291C10.9674 45.3993 10.1818 43.8826 10.1818 42.0503C10.1818 38.714 12.7321 35.6135 15.7445 33.5259C18.9108 31.3319 23.2326 29.7647 28 29.7647ZM45.8182 32.2941C48.4769 32.2941 50.8895 33.1655 52.6739 34.4021C54.3045 35.532 56 37.4129 56 39.7018C56 41.01 55.428 42.0953 54.5753 42.8729C53.7956 43.5836 52.8322 43.9997 51.9553 44.2635C50.7587 44.6232 49.3459 44.8076 47.8797 44.8886C48.1911 44.0164 48.3636 43.0671 48.3636 42.0503C48.3636 38.1667 45.9225 34.8701 43.191 32.5799C44.0277 32.3961 44.9084 32.2941 45.8182 32.2941ZM10.1818 32.2941C11.0914 32.2941 11.9723 32.3961 12.809 32.5799C10.0774 34.8701 7.63636 38.1667 7.63636 42.0503C7.63636 43.0671 7.80902 44.0164 8.12018 44.8886C6.65405 44.8076 5.24129 44.6232 4.04475 44.2635C3.16769 43.9997 2.20434 43.5836 1.42472 42.8729C0.571887 42.0953 0 41.01 0 39.7018C0 37.4129 1.69558 35.532 3.32607 34.4021C5.11046 33.1655 7.52312 32.2941 10.1818 32.2941ZM44.5455 17.1176C48.06 17.1176 50.9091 19.9488 50.9091 23.4412C50.9091 26.9335 48.06 29.7647 44.5455 29.7647C41.0309 29.7647 38.1818 26.9335 38.1818 23.4412C38.1818 19.9488 41.0309 17.1176 44.5455 17.1176ZM11.4545 17.1176C14.9691 17.1176 17.8182 19.9488 17.8182 23.4412C17.8182 26.9335 14.9691 29.7647 11.4545 29.7647C7.94001 29.7647 5.09091 26.9335 5.09091 23.4412C5.09091 19.9488 7.94001 17.1176 11.4545 17.1176ZM28 7C33.6232 7 38.1818 11.5298 38.1818 17.1176C38.1818 22.7055 33.6232 27.2353 28 27.2353C22.3767 27.2353 17.8182 22.7055 17.8182 17.1176C17.8182 11.5298 22.3767 7 28 7Z" fill={`url(#${gradientId})`}/>
      </g>
      <defs>
        <linearGradient id={gradientId} x1="3.02198" y1="-2.65277" x2="66.2835" y2="17.1525" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="56" height="56" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconCake({ size = 28 }: { size?: number }) {
  const iconId = React.useId();
  const gradientId = `${iconId}-career-cake-icon-gradient`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M13.2376 1.14618L10.6008 5.65877C10.1934 6.35549 9.97906 7.15939 9.97906 7.97402V8.27414C9.97906 10.643 11.8977 12.5616 14.2666 12.5616C16.6354 12.5616 18.5541 10.643 18.5541 8.27414V7.97402C18.5541 7.15939 18.3397 6.3662 17.9324 5.65877L15.2956 1.14618C15.0812 0.781741 14.6953 0.556641 14.2666 0.556641C13.8378 0.556641 13.4519 0.781741 13.2376 1.14618ZM26.9576 1.14618L24.3208 5.65877C23.9134 6.35549 23.6991 7.15939 23.6991 7.97402V8.27414C23.6991 10.643 25.6177 12.5616 27.9866 12.5616C30.3554 12.5616 32.2741 10.643 32.2741 8.27414V7.97402C32.2741 7.15939 32.0597 6.3662 31.6524 5.65877L29.0156 1.14618C28.8012 0.781741 28.4153 0.556641 27.9866 0.556641C27.5578 0.556641 27.1719 0.781741 26.9576 1.14618ZM38.0408 5.65877C37.6334 6.35549 37.4191 7.15939 37.4191 7.97402V8.27414C37.4191 10.643 39.3377 12.5616 41.7066 12.5616C44.0754 12.5616 45.9941 10.643 45.9941 8.27414V7.97402C45.9941 7.15939 45.7797 6.3662 45.3724 5.65877L42.7356 1.14618C42.5212 0.781741 42.1353 0.556641 41.7066 0.556641C41.2778 0.556641 40.8919 0.781741 40.6776 1.14618L38.0408 5.65877ZM17.6966 19.4216C17.6966 17.5244 16.1638 15.9916 14.2666 15.9916C12.3694 15.9916 10.8366 17.5244 10.8366 19.4216V24.5666C7.05284 24.5666 3.97656 27.6429 3.97656 31.4266V39.037C4.86621 39.5943 5.91665 40.0016 7.06356 40.0016C8.51059 40.0016 9.97906 39.3478 11.1796 38.5653C11.7584 38.1902 12.2407 37.8043 12.573 37.5256C12.7338 37.3863 12.8624 37.2684 12.9482 37.1933C12.991 37.1505 13.0232 37.129 13.0339 37.1076L13.0446 37.0969C13.3769 36.7539 13.8378 36.5716 14.3202 36.5824C14.8025 36.5931 15.242 36.8075 15.5635 37.1612L15.5743 37.1719L15.6493 37.2469C15.7243 37.322 15.8315 37.4291 15.9816 37.5685C16.2817 37.8472 16.7104 38.2223 17.2464 38.5868C18.3397 39.3478 19.7117 39.9909 21.1373 39.9909C22.5629 39.9909 23.9349 39.3478 25.0282 38.5868C25.5641 38.2116 25.9929 37.8472 26.293 37.5685C26.4431 37.4291 26.5503 37.322 26.6253 37.2469L26.7003 37.1719L26.711 37.1612C27.0326 36.786 27.5042 36.5824 27.9973 36.5824C28.4903 36.5824 28.962 36.7967 29.2835 37.1612L29.2943 37.1719L29.3693 37.2469C29.4443 37.322 29.5515 37.4291 29.7016 37.5685C30.0017 37.8472 30.4304 38.2223 30.9664 38.5868C32.0597 39.3478 33.4317 39.9909 34.8573 39.9909C36.2829 39.9909 37.6549 39.3478 38.7482 38.5868C39.2841 38.2116 39.7129 37.8472 40.013 37.5685C40.1631 37.4291 40.2702 37.322 40.3453 37.2469L40.4203 37.1719L40.431 37.1612C40.7419 36.7967 41.1921 36.5931 41.6744 36.5824C42.1567 36.5717 42.6069 36.7539 42.9499 37.0969L42.9607 37.1076L43.0464 37.1933C43.1322 37.2684 43.2501 37.3863 43.4216 37.5256C43.7538 37.8043 44.2255 38.1902 44.815 38.5653C46.0155 39.3478 47.484 40.0016 48.931 40.0016C50.0779 40.0016 51.1283 39.5836 52.018 39.037V31.4266C52.018 27.6429 48.9417 24.5666 45.158 24.5666V19.4216C45.158 17.5244 43.6252 15.9916 41.728 15.9916C39.8308 15.9916 38.298 17.5244 38.298 19.4216V24.5666H31.4166V19.4216C31.4166 17.5244 29.8838 15.9916 27.9866 15.9916C26.0894 15.9916 24.5566 17.5244 24.5566 19.4216V24.5666H17.6966L17.6966 19.4216ZM51.9966 42.8528C51.0855 43.2066 50.0458 43.4316 48.9096 43.4316C46.4978 43.4316 44.3648 42.3705 42.9285 41.438C42.489 41.1486 42.0924 40.8591 41.7602 40.6019C41.46 40.8591 41.1063 41.1378 40.7097 41.4058C39.327 42.3598 37.269 43.4316 34.8466 43.4316C32.4241 43.4316 30.3661 42.3598 28.9941 41.4058C28.619 41.1486 28.276 40.8806 27.9866 40.6341C27.6972 40.8806 27.3542 41.1378 26.979 41.4058C25.607 42.3598 23.549 43.4316 21.1266 43.4316C18.7041 43.4316 16.6461 42.3598 15.2741 41.4058C14.8775 41.1271 14.5238 40.8484 14.2237 40.6019C13.8914 40.8591 13.4948 41.1486 13.0553 41.438C11.6083 42.3705 9.47528 43.4316 7.06356 43.4316C5.92738 43.4316 4.88765 43.1958 3.97656 42.8528V52.0066C3.97656 53.9039 5.50934 55.4366 7.40656 55.4366H48.5666C50.4638 55.4366 51.9966 53.9039 51.9966 52.0066V42.8528Z" fill={`url(#${gradientId})`}/>
      <defs>
        <linearGradient id={gradientId} x1="6.56907" y1="-11.763" x2="63.6323" y2="0.24524" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function IconRocket({ size = 28 }: { size?: number }) {
  const iconId = React.useId();
  const gradientPrimaryId = `${iconId}-career-rocket-icon-gradient-primary`;
  const gradientSecondaryId = `${iconId}-career-rocket-icon-gradient-secondary`;
  const gradientAccentId = `${iconId}-career-rocket-icon-gradient-accent`;
  const clipId = `${iconId}-career-rocket-icon-clip`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 56 56" fill="none">
      <g clipPath={`url(#${clipId})`}>
        <path d="M36.9256 15.8496C36.1694 15.85 35.4365 16.1128 34.8521 16.5929C34.2677 17.073 33.8678 17.7409 33.7207 18.4828C33.5736 19.2247 33.688 19.9947 34.045 20.6615C34.4019 21.3283 34.9789 21.8509 35.6779 22.14C36.3767 22.4291 37.1542 22.4669 37.878 22.247C38.6016 22.0271 39.2268 21.5632 39.6465 20.9342C40.0665 20.305 40.2553 19.5499 40.1809 18.7972C40.1066 18.0446 39.7734 17.3411 39.2383 16.8064C38.935 16.5024 38.5745 16.2612 38.1776 16.0971C37.7806 15.933 37.3553 15.8488 36.9256 15.8496Z" fill={`url(#${gradientPrimaryId})`}/>
        <path d="M55.1212 2.76875C55.1205 2.76501 55.1205 2.76128 55.1212 2.75766C55.0176 2.3036 54.7892 1.88745 54.4616 1.55635C54.1341 1.22513 53.7205 0.992031 53.2676 0.883414C49.6171 -0.00710285 43.8745 0.942214 37.5105 3.49021C31.0964 6.06271 25.0864 9.86021 21.0243 13.9298C19.7223 15.2249 18.5127 16.6095 17.4045 18.074C14.6692 17.9514 12.2595 18.3411 10.2296 19.2267C3.1565 22.3393 1.13641 30.3056 0.598698 33.5763C0.520881 34.041 0.551331 34.5176 0.687714 34.9685C0.824098 35.4194 1.06268 35.833 1.38503 36.1768C1.70726 36.5206 2.10463 36.7853 2.54586 36.9503C2.98721 37.1155 3.46065 37.1765 3.92953 37.1288H3.9454L11.8246 36.269C11.8344 36.3694 11.8454 36.4613 11.854 36.5458C11.9551 37.5059 12.3833 38.402 13.0667 39.0839L16.9121 42.9317C17.5928 43.6161 18.4888 44.0448 19.449 44.1456L19.7124 44.1739L18.8549 52.0433V52.0592C18.8111 52.483 18.8562 52.9113 18.9873 53.3167C19.1185 53.7221 19.3329 54.0957 19.6165 54.4136C19.9003 54.7314 20.2471 54.9867 20.6352 55.1627C21.0231 55.3389 21.4435 55.4322 21.8697 55.4366C22.0399 55.4368 22.2099 55.4228 22.3781 55.395C25.6672 54.8658 33.6297 52.8702 36.7339 45.759C37.6123 43.7427 38.0005 41.343 37.8914 38.6124C39.3622 37.5064 40.7522 36.2968 42.0504 34.9924C46.1456 30.9181 49.9553 24.9572 52.5009 18.6362C55.0354 12.3446 55.9897 6.5589 55.1212 2.76875ZM42.0063 24.1917C40.9997 25.1992 39.7169 25.8857 38.3202 26.1639C36.9235 26.4424 35.4756 26.3002 34.1595 25.7556C32.8436 25.211 31.7188 24.2881 30.9274 23.1041C30.136 21.9199 29.7136 20.5277 29.7136 19.1035C29.7136 17.6792 30.136 16.287 30.9274 15.103C31.7188 13.9188 32.8436 12.9962 34.1595 12.4514C35.4756 11.9068 36.9236 11.7648 38.3202 12.0429C39.7169 12.3214 40.9997 13.0078 42.0063 14.0155C42.681 14.6799 43.2168 15.4721 43.5824 16.3456C43.948 17.219 44.1365 18.1565 44.1365 19.1035C44.1365 20.0505 43.948 20.988 43.5824 21.8615C43.2168 22.735 42.681 23.527 42.0063 24.1917Z" fill={`url(#${gradientSecondaryId})`}/>
        <path d="M16.4708 43.9754C15.9969 43.9166 15.5177 44.0327 15.1235 44.3025C14.3408 44.8377 13.5544 45.3668 12.7608 45.8825C11.1551 46.9261 9.23451 45.0937 10.1886 43.4327L11.6768 40.8607C11.8896 40.5494 12.008 40.1834 12.0181 39.8066C12.0281 39.4298 11.9292 39.0579 11.7332 38.7358C11.537 38.4137 11.2524 38.1552 10.913 37.9909C10.5737 37.8265 10.1941 37.7636 9.81994 37.8095C8.16829 38.0184 6.63296 38.7708 5.45591 39.9482C5.00768 40.3977 3.64443 41.7622 2.91071 46.9616C2.70188 48.455 2.57028 49.9582 2.51626 51.4652C2.50961 51.7268 2.55534 51.9869 2.65078 52.2307C2.74633 52.4743 2.88959 52.6963 3.07218 52.8836C3.25488 53.0709 3.47316 53.2198 3.71431 53.3214C3.95534 53.423 4.21434 53.4753 4.47603 53.4751H4.52503C6.03318 53.4218 7.53771 53.291 9.03232 53.0833C14.2343 52.3484 15.5987 50.9838 16.047 50.5356C17.2299 49.358 17.9804 47.8155 18.1769 46.1582C18.24 45.6424 18.0957 45.1229 17.7757 44.7136C17.4558 44.3043 16.9864 44.0388 16.4708 43.9754Z" fill={`url(#${gradientAccentId})`}/>
      </g>
      <defs>
        <linearGradient id={gradientPrimaryId} x1="34.011" y1="14.3818" x2="41.6784" y2="16.2249" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradientSecondaryId} x1="3.51809" y1="-11.763" x2="67.8701" y2="3.70626" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradientAccentId} x1="3.36155" y1="34.275" x2="21.744" y2="38.6927" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="56" height="56" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconChart({ size = 28 }: { size?: number }) {
  const iconId = React.useId();
  const gradientId = `${iconId}-career-chart-icon-gradient`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M12.8307 30.3307C15.4081 30.3307 17.4974 32.42 17.4974 34.9974V48.9974C17.4974 50.2861 16.4527 51.3307 15.1641 51.3307H6.9974C5.70874 51.3307 4.66406 50.2861 4.66406 48.9974V34.9974C4.66406 32.42 6.7534 30.3307 9.33073 30.3307H12.8307ZM29.7474 23.3307C32.3248 23.3307 34.4141 25.42 34.4141 27.9974V48.9974C34.4141 50.2861 33.3694 51.3307 32.0807 51.3307H23.9141C22.6254 51.3307 21.5807 50.2861 21.5807 48.9974V27.9974C21.5807 25.42 23.67 23.3307 26.2474 23.3307H29.7474ZM46.6641 9.33073C49.2415 9.33073 51.3307 11.4201 51.3307 13.9974V48.9974C51.3307 50.2861 50.2861 51.3307 48.9974 51.3307H40.8307C39.542 51.3307 38.4974 50.2861 38.4974 48.9974V13.9974C38.4974 11.4201 40.5867 9.33073 43.1641 9.33073H46.6641ZM23.3307 4.66406C24.6192 4.66416 25.6641 5.70879 25.6641 6.9974V15.1641C25.6641 16.4527 24.6192 17.4973 23.3307 17.4974C22.0422 17.4972 20.9974 16.4526 20.9974 15.1641V12.6302L12.7305 20.8971C11.8193 21.8082 10.3422 21.8082 9.43099 20.8971C8.51997 19.9859 8.51997 18.5089 9.43099 17.5977L17.6979 9.33073H15.1641C13.8755 9.33057 12.8307 8.28596 12.8307 6.9974C12.8307 5.70884 13.8755 4.66423 15.1641 4.66406H23.3307Z" fill={`url(#${gradientId})`}/>
      <defs>
        <linearGradient id={gradientId} x1="7.18238" y1="-5.81181" x2="61.905" y2="7.34309" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function IconParty({ size = 28 }: { size?: number }) {
  const iconId = React.useId();
  const gradient1Id = `${iconId}-career-party-icon-gradient-1`;
  const gradient2Id = `${iconId}-career-party-icon-gradient-2`;
  const gradient3Id = `${iconId}-career-party-icon-gradient-3`;
  const gradient4Id = `${iconId}-career-party-icon-gradient-4`;
  const gradient5Id = `${iconId}-career-party-icon-gradient-5`;
  const gradient6Id = `${iconId}-career-party-icon-gradient-6`;
  const gradient7Id = `${iconId}-career-party-icon-gradient-7`;
  const gradient8Id = `${iconId}-career-party-icon-gradient-8`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M19.134 3.16222C20.1239 3.76739 20.4357 5.06045 19.8307 6.05038C19.3915 6.76872 19.5015 7.69436 20.0968 8.2897L20.371 8.56387C22.02 10.2128 22.6278 12.6351 21.9533 14.8672C21.6175 15.9778 20.4449 16.606 19.3343 16.2703C18.2238 15.9345 17.5956 14.7621 17.9313 13.6514C18.1579 12.9019 17.9537 12.0886 17.4001 11.5349L17.1259 11.2607C15.1581 9.29288 14.7943 6.23326 16.2458 3.85887C16.851 2.86897 18.1441 2.55704 19.134 3.16222Z" fill={`url(#${gradient1Id})`}/>
      <path d="M41.4242 9.10956C42.5618 9.33709 43.2996 10.4439 43.0721 11.5816L42.6688 13.5982C42.1139 16.3735 40.1142 18.6387 37.4291 19.5337C36.1745 19.9519 35.24 21.0104 34.9806 22.3072L34.5773 24.3237C34.3498 25.4615 33.2431 26.1993 32.1053 25.9718C30.9675 25.7444 30.2297 24.6374 30.4572 23.4998L30.8605 21.4832C31.4157 18.7078 33.4154 16.4427 36.1005 15.5477C37.3551 15.1295 38.2896 14.071 38.5489 12.7742L38.952 10.7576C39.1797 9.61986 40.2865 8.88203 41.4242 9.10956Z" fill={`url(#${gradient2Id})`}/>
      <path d="M51.8413 33.8806C50.8282 33.4378 49.65 33.6238 48.8226 34.3574C46.5557 36.3674 43.2571 36.7016 40.6334 35.1868L40.037 34.8425C39.0323 34.2624 38.688 32.9775 39.2681 31.9728C39.8482 30.9681 41.1331 30.6238 42.1378 31.2039L42.7342 31.5482C43.7916 32.1585 45.1213 32.0241 46.035 31.2137C48.0876 29.3936 51.0108 28.932 53.5245 30.0311L54.341 30.388C55.404 30.8529 55.8892 32.0913 55.4242 33.1546C54.9595 34.2176 53.7208 34.7025 52.6578 34.2378L51.8413 33.8806Z" fill={`url(#${gradient3Id})`}/>
      <path d="M12.8071 52.5995C6.47228 54.688 3.13463 55.5619 1.2883 53.7158C-0.756155 51.6712 0.534862 47.7982 3.11692 40.0521L7.84932 25.8548C9.61965 20.5438 10.6596 17.4238 12.3951 16.1582L12.3805 16.2305C12.3603 16.3311 12.331 16.4781 12.2942 16.6672C12.2206 17.0452 12.1167 17.592 11.994 18.2732C11.7486 19.6346 11.4274 21.5371 11.1232 23.7048C10.5206 27.9993 9.96242 33.4867 10.25 37.8715C10.424 40.5249 10.976 43.8162 11.4686 46.3881C11.7172 47.6862 11.9553 48.8237 12.1312 49.6374C12.2193 50.0444 12.2919 50.371 12.3428 50.597L12.402 50.8578L12.8071 52.5995Z" fill={`url(#${gradient4Id})`}/>
      <path d="M28.3953 47.3989L29.1426 47.1498C35.5798 45.0039 38.7982 43.9311 39.3974 41.3928C39.9968 38.8542 37.5977 36.4553 32.8 31.6574L28.0681 26.9258L28.055 26.9672C28.0001 27.1403 27.9205 27.3952 27.8247 27.7157C27.6326 28.3577 27.3763 29.2566 27.1202 30.2812C26.5964 32.3786 26.1211 34.8243 26.1211 36.6674C26.1211 38.5102 26.5964 40.9558 27.1202 43.0535C27.3763 44.0782 27.6326 44.977 27.8247 45.6191C27.9205 45.9395 28.0001 46.1944 28.055 46.3675C28.0824 46.4541 28.1037 46.5202 28.1177 46.5633L28.1334 46.6112L28.137 46.6218L28.3953 47.3989Z" fill={`url(#${gradient5Id})`}/>
      <path d="M16.5309 16.9039L16.6728 16.2168C18.3891 17.2234 20.4219 19.2561 23.3452 22.1794L24.7535 23.5879L24.1577 25.3807L24.1323 25.4588C24.1152 25.5109 24.0908 25.5865 24.0603 25.6829C23.9989 25.8756 23.9127 26.1529 23.8096 26.4975C23.6034 27.186 23.3289 28.1487 23.0538 29.2501C22.5158 31.4047 21.9295 34.2682 21.9295 36.6542C21.9295 39.0401 22.5158 41.9037 23.0538 44.0583C23.3289 45.1596 23.6034 46.1224 23.8096 46.8106C23.9127 47.1554 23.9989 47.4324 24.0603 47.6254C24.0908 47.7218 24.1152 47.7971 24.1323 47.8495L24.4194 48.7142L16.8145 51.2492L16.5153 49.9632L16.501 49.9013L16.4453 49.6556C16.3967 49.4402 16.3267 49.1254 16.2414 48.731C16.0708 47.9419 15.8398 46.8378 15.5987 45.5795C15.1121 43.0389 14.6022 39.9592 14.4461 37.5785C14.1883 33.6464 14.692 28.5151 15.2875 24.2706C15.5825 22.1686 15.8944 20.3212 16.1325 19.0002C16.2514 18.3402 16.3518 17.8126 16.422 17.4517C16.4571 17.2712 16.4847 17.1325 16.5033 17.0398L16.5244 16.9357L16.5295 16.9106L16.5309 16.9039Z" fill={`url(#${gradient6Id})`}/>
      <path d="M32.5098 3.36518C32.9348 3.30882 33.7093 3.28176 34.3249 3.89733C34.9403 4.51292 34.9134 5.28739 34.8571 5.71223C34.8036 6.11377 34.6669 6.59479 34.5364 7.05308L34.4361 7.40602L34.6174 7.69301C34.8625 8.08116 35.1258 8.49816 35.2871 8.86905C35.4689 9.28744 35.6756 9.99365 35.2857 10.7356C34.9034 11.4634 34.2185 11.703 33.7826 11.802C33.3863 11.8922 32.8902 11.9307 32.4188 11.9673L32.0617 11.9952L32.032 11.9975L31.7746 12.31C31.4676 12.6834 31.1488 13.0709 30.8482 13.3457C30.53 13.6368 29.932 14.0856 29.0995 13.9716C28.2385 13.8537 27.792 13.2302 27.5757 12.8406C27.3802 12.4878 27.2088 12.0234 27.0491 11.5906L26.9365 11.2856L26.6315 11.173C26.1987 11.0133 25.7343 10.842 25.3817 10.6463C24.992 10.4303 24.3685 9.98382 24.2506 9.12277C24.1366 8.29017 24.5853 7.69223 24.8766 7.37397C25.1514 7.07353 25.5388 6.75474 25.9122 6.44754L26.2248 6.19026L26.227 6.16052L26.2547 5.80335C26.2914 5.33182 26.3301 4.83597 26.4203 4.43948C26.5192 4.00374 26.7587 3.31896 27.4867 2.93642C28.2287 2.54645 28.9348 2.75337 29.353 2.93519C29.7242 3.09642 30.141 3.3598 30.5292 3.60498L30.8163 3.78604L31.169 3.68574C31.6275 3.55532 32.1084 3.41843 32.5098 3.36518Z" fill={`url(#${gradient7Id})`}/>
      <path d="M53.8909 25.2921C55.1993 23.9834 55.683 22.222 54.9662 20.6705C54.4225 19.4935 53.3225 18.728 51.9716 18.4397C51.6833 17.0888 50.9178 15.9886 49.7408 15.445C48.1893 14.7283 46.4277 15.212 45.1193 16.5204C44.3605 17.2792 44.0168 18.296 43.8557 19.2015C43.691 20.1278 43.688 21.107 43.7429 21.9648C43.7983 22.831 43.9165 23.6253 44.0199 24.1996C44.0717 24.4882 44.1204 24.7251 44.1566 24.8918C44.1748 24.9755 44.1899 25.0416 44.2008 25.0884C44.3258 25.5929 44.7386 26.0666 45.2428 26.1912L45.2462 26.192L45.3229 26.2103C45.3694 26.2212 45.4358 26.2363 45.5193 26.2545C45.6862 26.2909 45.9229 26.3397 46.2117 26.3915C46.7859 26.4946 47.5803 26.613 48.4464 26.6685C49.3044 26.7234 50.2834 26.72 51.2097 26.5553C52.1153 26.3943 53.1321 26.0506 53.8909 25.2921Z" fill={`url(#${gradient8Id})`}/>
      <defs>
        <linearGradient id={gradient1Id} x1="15.7317" y1="-0.17861" x2="24.1189" y2="0.845784" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient2Id} x1="31.1012" y1="5.26457" x2="46.3558" y2="8.01246" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient3Id} x1="39.8829" y1="27.94" x2="55.0742" y2="37.0115" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient4Id} x1="0.955346" y1="7.50069" x2="16.4005" y2="8.70677" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient5Id} x1="26.8424" y1="22.3299" x2="43.0238" y2="24.8696" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient6Id} x1="14.9369" y1="8.35263" x2="27.743" y2="9.26447" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient7Id} x1="24.8409" y1="0.183813" x2="38.0621" y2="3.36208" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
        <linearGradient id={gradient8Id} x1="44.3362" y1="12.5122" x2="57.9235" y2="15.7784" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function BenefitIcon({ type, size = 28 }: { type: string; size?: number }) {
  if (type === 'users')  return <IconUsers size={size} />;
  if (type === 'cake')   return <IconCake size={size} />;
  if (type === 'rocket') return <IconRocket size={size} />;
  if (type === 'chart')  return <IconChart size={size} />;
  if (type === 'party')  return <IconParty size={size} />;
  return null;
}

// ─── INSTAGRAM ICON ───────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
    </svg>
  );
}

function OfficeCarouselArrow({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right'; onClick: () => void; disabled: boolean; gradientId: string;
}) {
  const arrowPath = direction === 'left'
    ? 'M18.666 24L10.666 16L18.666 8'
    : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
      style={{
        width: 56, height: 56, border: 'none', padding: 0, flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="28" cy="28" r="28" fill={`url(#${gradientId})`} />}
        <svg x="12" y="12" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d={arrowPath}
            stroke={disabled ? 'rgba(18,18,18,0.4)' : 'white'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </svg>
    </button>
  );
}

function CareerHeroVideoFrame({
  embedSrc,
  title,
  interactive = true,
}: {
  embedSrc: string;
  title: string;
  interactive?: boolean;
}) {
  return (
    <LazyGumletEmbed
      embedSrc={embedSrc}
      title={title}
      rootMargin="0px 100px"
      iframePointerEvents={interactive ? 'auto' : 'none'}
      placeholderLabel="Video loads when this slide is near"
    />
  );
}

function getCarouselStep(container: HTMLDivElement | null, selector: string) {
  if (!container) return 0;
  const firstCard = container.querySelector<HTMLElement>(selector);
  if (!firstCard) return 0;
  const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;
  return firstCard.offsetWidth + gap;
}

function getCarouselMaxIndex(container: HTMLDivElement | null, selector: string) {
  const step = getCarouselStep(container, selector);
  if (!container || !step) return 0;
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  return Math.ceil(maxScroll / step);
}

function CareerHeroVideoCarousel({ variant }: { variant: 'mobile' | 'desktop' }) {
  const videos = CAREER_HERO_VIDEOS;
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [desktopMaxIndex, setDesktopMaxIndex] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canMobilePrev,
    canNext: canMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-career-hero-mobile-video]',
    itemCount: videos.length,
  });

  useEffect(() => {
    if (variant !== 'desktop') return;
    const container = desktopScrollRef.current;
    if (!container) return;

    const syncState = () => {
      const step = getCarouselStep(container, '[data-career-hero-video]');
      const maxIndex = getCarouselMaxIndex(container, '[data-career-hero-video]');
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      setDesktopMaxIndex(maxIndex);
      if (!step) {
        setDesktopIndex(0);
        return;
      }
      const index = container.scrollLeft >= maxScroll - 2 ? maxIndex : Math.round(container.scrollLeft / step);
      setDesktopIndex(Math.min(Math.max(index, 0), maxIndex));
    };

    syncState();
    const resizeObserver = new ResizeObserver(syncState);
    resizeObserver.observe(container);
    container.addEventListener('scroll', syncState, { passive: true });
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', syncState);
    };
  }, [variant]);

  const desktopScrollTo = (index: number) => {
    const container = desktopScrollRef.current;
    const clamped = Math.min(Math.max(index, 0), desktopMaxIndex);
    setDesktopIndex(clamped);
    if (container) {
      const step = getCarouselStep(container, '[data-career-hero-video]');
      container.scrollTo({ left: clamped * step, behavior: 'smooth' });
    }
  };

  if (variant === 'mobile') {
    return (
      <div className="w-full">
        <style>{`.career-hero-scrollbarless::-webkit-scrollbar{display:none}`}</style>
        <div
          ref={mobileScrollRef}
          className="career-hero-scrollbarless flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[16px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              data-career-hero-mobile-video=""
              className="relative h-[528px] w-[297px] max-w-[calc(100vw-40px)] flex-shrink-0 snap-center overflow-hidden rounded-[12px] bg-[#111]"
            >
              <CareerHeroVideoFrame embedSrc={video.embedSrc} title={video.title} interactive={false} />
            </div>
          ))}
          <div className="w-[1px] flex-shrink-0" />
        </div>

        <div className="mt-[32px] flex items-center justify-center gap-[12px] px-[16px]">
          <OfficeCarouselArrow
            direction="left"
            onClick={scrollMobilePrev}
            disabled={!canMobilePrev}
            gradientId="career-hero-mobile-left"
          />
          <div
            className="flex min-w-0 flex-shrink-0 items-center justify-center gap-[8px]"
            style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)' }}
          >
            {videos.map((_, i) => (
              <button key={i} type="button" onClick={() => scrollMobileTo(i)} style={{
                width: i === mobileIndex ? 32 : 8, height: 8, borderRadius: 10,
                border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
                background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                transition: 'all 300ms ease',
              }} />
            ))}
          </div>
          <OfficeCarouselArrow
            direction="right"
            onClick={scrollMobileNext}
            disabled={!canMobileNext}
            gradientId="career-hero-mobile-right"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1236px]">
      <style>{`.career-hero-scrollbarless::-webkit-scrollbar{display:none}`}</style>
      <div
        ref={desktopScrollRef}
        className="career-hero-scrollbarless mx-auto flex h-[529px] gap-[16px] overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            data-career-hero-video=""
            className="relative h-[529px] w-[297px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#111]"
          >
            <CareerHeroVideoFrame embedSrc={video.embedSrc} title={video.title} />
          </div>
        ))}
      </div>

      {desktopMaxIndex > 0 && (
        <div className="mt-[24px] flex justify-end gap-3">
          <OfficeCarouselArrow
            direction="left"
            onClick={() => desktopScrollTo(desktopIndex - 1)}
            disabled={desktopIndex === 0}
            gradientId="career-hero-desktop-left"
          />
          <OfficeCarouselArrow
            direction="right"
            onClick={() => desktopScrollTo(desktopIndex + 1)}
            disabled={desktopIndex === desktopMaxIndex}
            gradientId="career-hero-desktop-right"
          />
        </div>
      )}
    </div>
  );
}

function CareerOfficeSection({ variant }: { variant: 'mobile' | 'desktop' }) {
  const slides = CAREER_OFFICE_ASSETS;
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canMobilePrev,
    canNext: canMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-office-mobile-card]',
    itemCount: slides.length,
  });

  const getDesktopStep = () => {
    const container = desktopScrollRef.current;
    if (!container) return 0;
    const firstCard = container.querySelector<HTMLElement>('[data-office-card]');
    if (!firstCard) return 0;
    const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;
    return firstCard.offsetWidth + gap;
  };

  useEffect(() => {
    if (variant !== 'desktop') return;
    const container = desktopScrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const step = getDesktopStep();
      if (!step) return;
      const index = Math.round(container.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [slides.length, variant]);

  const desktopScrollTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    setActiveIndex(clamped);
    if (desktopScrollRef.current) {
      const step = getDesktopStep();
      desktopScrollRef.current.scrollTo({ left: clamped * step, behavior: 'smooth' });
    }
  };

  if (variant === 'mobile') {
    return (
      <section className="w-full bg-white py-[72px]">
        <style>{`.career-office-scrollbarless::-webkit-scrollbar{display:none}`}</style>
        <h2 className="mb-[32px] pl-[16px] pr-[16px] text-left text-[26px] font-extrabold leading-[31px] tracking-[-0.5px] text-[#121212]">
          P.S. - Check Out Our Office
        </h2>

        <div
          ref={mobileScrollRef}
          className="career-office-scrollbarless flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[16px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {slides.map((item) => (
            <div
              key={item.id}
              data-office-mobile-card=""
              className="relative aspect-[334/460] w-[334px] max-w-[calc(100vw-32px)] flex-shrink-0 snap-center overflow-hidden rounded-[12px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 366px) calc(100vw - 32px), 334px"
              />
            </div>
          ))}
          <div className="w-[1px] flex-shrink-0" />
        </div>

        <div className="mt-[40px] flex items-center justify-center gap-[12px] px-[16px]">
          <OfficeCarouselArrow
            direction="left"
            onClick={scrollMobilePrev}
            disabled={!canMobilePrev}
            gradientId="career-office-mobile-left"
          />
          <div
            className="flex min-w-0 flex-shrink-0 items-center justify-center gap-[8px]"
            style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)' }}
          >
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => scrollMobileTo(i)} style={{
                width: i === mobileIndex ? 32 : 8, height: 8, borderRadius: 10,
                border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
                background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                transition: 'all 300ms ease',
              }} />
            ))}
          </div>
          <OfficeCarouselArrow
            direction="right"
            onClick={scrollMobileNext}
            disabled={!canMobileNext}
            gradientId="career-office-mobile-right"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-white py-[60px] md:py-[80px] lg:py-20">
      <style>{`.career-office-scrollbarless::-webkit-scrollbar{display:none}`}</style>
      <div className="mx-auto max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px]">
        <h2 className="mb-[32px] text-center text-[32px] font-extrabold text-dark md:text-[48px] lg:mb-12 lg:text-left lg:text-5xl">
          P.S. - Check Out Our Office
        </h2>
      </div>

      <div className="relative mb-[32px]">
        <div
          ref={desktopScrollRef}
          className="career-office-scrollbarless flex h-[418px] gap-3 overflow-x-auto"
          style={{
            paddingLeft: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {slides.map((item, index) => (
            <div
              key={item.id}
              data-office-card=""
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative h-full flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-in-out ${
                activeIndex === index
                  ? 'w-[560px] lg:w-[660px] xl:w-[740px]'
                  : 'w-[120px] lg:w-[160px] xl:w-[184px]'
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className={`object-cover object-center transition-transform duration-700 ${activeIndex === index ? 'scale-100' : 'scale-110'}`}
                sizes={activeIndex === index
                  ? '(min-width: 1280px) 740px, (min-width: 1024px) 660px, 560px'
                  : '(min-width: 1280px) 184px, (min-width: 1024px) 160px, 120px'
                }
              />
            </div>
          ))}
          <div className="w-[120px] flex-shrink-0" />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-[200px]"
          style={{ background: 'linear-gradient(to right, transparent, #ffffff)' }}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px]">
        <div className="flex justify-end gap-3">
          <OfficeCarouselArrow
            direction="left"
            onClick={() => desktopScrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            gradientId="career-office-desktop-left"
          />
          <OfficeCarouselArrow
            direction="right"
            onClick={() => desktopScrollTo(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            gradientId="career-office-desktop-right"
          />
        </div>
      </div>
    </section>
  );
}

function CareerBenefitCard({
  benefit,
  mobile,
}: {
  benefit: (typeof BENEFITS)[number];
  mobile: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        background: '#FFF',
        borderRadius: 12,
        border: '1px solid rgba(18,18,18,0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: mobile ? 12 : 18,
        padding: mobile ? 12 : 16,
        minHeight: mobile ? 92 : 114,
      }}
    >
      <div
        style={{
          width: mobile ? 68 : 82,
          height: mobile ? 68 : 82,
          padding: mobile ? 12 : 13,
          flexShrink: 0,
          borderRadius: 12,
          background: 'rgba(23, 105, 255, 0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BenefitIcon type={benefit.iconType} size={mobile ? 44 : 56} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            color: '#121212',
            fontFamily: '"Proxima Nova", Arial, sans-serif',
            fontSize: mobile ? 18 : 20,
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '120%',
            letterSpacing: '-0.1px',
            margin: '0 0 4px',
          }}
        >
          {benefit.title}
        </p>
        <p
          style={{
            color: '#555',
            fontFamily: 'ProximaNova-Medium, "Proxima Nova", Arial, sans-serif',
            fontSize: mobile ? 16 : 18,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '150%',
            letterSpacing: '-0.16px',
            margin: 0,
          }}
        >
          {benefit.desc}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MOBILE PAGE  (pixel-perfect original, zero changes)
// ══════════════════════════════════════════════════════════════════════════════

function MobilePage() {
  return (
    <main id="career-mobile" style={{ minHeight: '100vh', background: '#fff', maxWidth: 430, margin: '0 auto', overflowX: 'hidden', fontFamily: 'var(--font-proxima, sans-serif)' }}>

      {/* HERO */}
      <section style={{ background: '#fff', paddingTop: 80, paddingBottom: 48, paddingLeft: 20, paddingRight: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 11px', background: '#F3F6FF', border: '1px solid rgba(18,18,18,0.05)', borderRadius: 6, marginBottom: 18 }}>
          <Users style={{ width: 16, height: 16, color: '#1769FF' }} />
          <span style={{ color: '#1769FF', fontWeight: 500, fontSize: 13 }}>Join Us</span>
        </div>
        <h1 style={{ color: '#121212', textAlign: 'center', fontFamily: '"Proxima Nova", Arial, sans-serif', fontSize: 32, fontStyle: 'normal', fontWeight: 800, lineHeight: '120%', letterSpacing: '-0.5px', margin: '0 0 18px', width: '100%', maxWidth: 320 }}>
          Life At<br />American Hairline
        </h1>
        <p style={{ color: '#121212', fontSize: 15, lineHeight: '24px', textAlign: 'center', margin: '0 0 24px', maxWidth: 320 }}>
          We&apos;re not just about hair; we&apos;re <strong>about people</strong>. We work fast, ask the right questions, and foster an <strong>environment</strong> where authenticity is key. Join a team that values <strong>creativity</strong>, innovation, and making a real impact. Good vibes, <strong>big ideas</strong>, and a shared passion for <strong>helping others</strong> regain their confidence await.
        </p>
        <a href="https://www.instagram.com/americanhairline/" target="_blank" rel="noopener noreferrer"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 24px', background: 'linear-gradient(90deg,#4686FE,#1769FF)', borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.15)', color: '#fff', textDecoration: 'none', marginBottom: 32, boxSizing: 'border-box' }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Our Team On Instagram</span>
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <InstagramIcon />
          </div>
        </a>
        <div style={{ width: 'calc(100% + 40px)', marginLeft: -20, marginRight: -20 }}>
          <CareerHeroVideoCarousel variant="mobile" />
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ background: '#F5F6F7', padding: '48px 20px' }}>
        <h2 style={{ color: '#121212', fontFamily: '"Proxima Nova", Arial, sans-serif', fontSize: 26, fontStyle: 'normal', fontWeight: 800, lineHeight: '120%', letterSpacing: '-0.5px', textTransform: 'capitalize', margin: '0 0 24px' }}>
          Why You Will Love<br />Working Here
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BENEFITS.map((b, i) => (
            <CareerBenefitCard key={i} benefit={b} mobile />
          ))}
        </div>
      </section>

      {/* OFFICE */}
      <CareerOfficeSection variant="mobile" />

      {/* APPLY NOW */}
      <section style={{ background: '#F5F6F7', padding: '48px 20px' }}>
        <h2 style={{ color: '#121212', fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.4px', margin: '0 0 24px' }}>
          Apply Now
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {JOBS.slice(0, 4).map((job, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(18,18,18,0.08)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ color: '#121212', fontSize: 18, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.3px' }}>{job.title}</h3>
                <p style={{ color: '#121212', fontSize: 14, margin: 0, lineHeight: '22px' }}>{job.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin style={{ width: 16, height: 16, color: '#121212' }} />
                  <span style={{ color: '#121212', fontSize: 13, fontWeight: 600 }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock style={{ width: 16, height: 16, color: '#121212' }} />
                  <span style={{ color: '#121212', fontSize: 13, fontWeight: 600 }}>{job.type}</span>
                </div>
              </div>
              <button type="button" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'linear-gradient(90deg,#4686FE,#1769FF)', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Apply Now</span>
                <ArrowUpRight style={{ width: 16, height: 16, color: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      </section>


    </main>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  DESKTOP PAGE
// ══════════════════════════════════════════════════════════════════════════════

function DesktopPage() {
  const PX = '160px';

  return (
    <main id="career-desktop" style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-proxima, sans-serif)', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{ background: '#fff', padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 11px', background: '#F3F6FF', border: '1px solid rgba(18,18,18,0.05)', borderRadius: 6, marginBottom: 32 }}>
          <Users style={{ width: 18, height: 18, color: '#1769FF' }} />
          <span style={{ color: '#1769FF', fontWeight: 500, fontSize: 14 }}>Join Us</span>
        </div>
        <h1 style={{ color: '#121212', textAlign: 'center', fontFamily: '"Proxima Nova", Arial, sans-serif', fontSize: 64, fontStyle: 'normal', fontWeight: 800, lineHeight: '120%', letterSpacing: '-0.5px', margin: '0 0 20px' }}>
          Life At American Hairline
        </h1>
        <p style={{ color: '#121212', fontSize: 20, lineHeight: '31px', textAlign: 'center', margin: '0 0 20px', maxWidth: 607 }}>
          <span>We&apos;re not just about hair; we&apos;re </span><strong>about people</strong>
          <span>. We work fast, ask the right questions, and foster an </span><strong>environment</strong>
          <span> where authenticity is key. Join a team that values </span><strong>creativity</strong>
          <span>, innovation, and making a real impact. Good vibes, </span><strong>big ideas</strong>
          <span>, and a shared passion for </span><strong>helping others</strong>
          <span> regain their confidence await.</span>
        </p>
        <a href="https://www.instagram.com/americanhairline/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 24px', background: 'linear-gradient(90deg,#4686FE,#1769FF)', borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.15)', color: '#fff', textDecoration: 'none', marginBottom: 44 }}>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.2px' }}>Our Team On Instagram</span>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <InstagramIcon />
          </div>
        </a>
        <CareerHeroVideoCarousel variant="desktop" />
      </section>

      {/* BENEFITS */}
      <section style={{ background: '#F5F6F7', padding: `120px ${PX}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#121212', textAlign: 'center', fontFamily: '"Proxima Nova", Arial, sans-serif', fontSize: 44, fontStyle: 'normal', fontWeight: 800, lineHeight: '120%', letterSpacing: '-0.5px', textTransform: 'capitalize', margin: '0 0 44px' }}>
          Why You Will Love<br />Working Here
        </h2>
        <div style={{ width: '100%', maxWidth: 1120, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {BENEFITS.slice(0, 2).map((b, i) => (
              <CareerBenefitCard key={i} benefit={b} mobile={false} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {BENEFITS.slice(2, 4).map((b, i) => (
              <CareerBenefitCard key={i} benefit={b} mobile={false} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 'calc(50% - 6px)', minWidth: 0 }}>
              <CareerBenefitCard benefit={BENEFITS[4]} mobile={false} />
            </div>
          </div>
        </div>
      </section>

      {/* OFFICE */}
      <CareerOfficeSection variant="desktop" />

      {/* APPLY NOW */}
      <section style={{ background: '#F5F6F7', padding: `120px ${PX}` }}>
        <h2 style={{ color: '#121212', fontSize: 44, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', margin: '0 0 44px' }}>
          Apply Now
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, width: '100%' }}>
          {JOBS.map((job, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(18,18,18,0.08)', padding: 32, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ color: '#121212', fontSize: 28, fontWeight: 700, margin: 0, lineHeight: '36px', letterSpacing: '-0.5px' }}>{job.title}</h3>
                <p style={{ color: '#121212', fontSize: 20, margin: 0, lineHeight: '28px', letterSpacing: '-0.16px' }}>{job.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin style={{ width: 18, height: 18, color: '#121212' }} />
                  <span style={{ color: '#121212', fontSize: 18, fontWeight: 600, letterSpacing: '0.4px' }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock style={{ width: 18, height: 18, color: '#121212' }} />
                  <span style={{ color: '#121212', fontSize: 18, fontWeight: 600, letterSpacing: '0.4px' }}>{job.type}</span>
                </div>
              </div>
              <button type="button" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'linear-gradient(90deg,#4686FE,#1769FF)', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-0.1px' }}>Apply Now</span>
                <ArrowUpRight style={{ width: 20, height: 20, color: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      </section>


    </main>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT EXPORT — renders mobile or desktop based on window width
// ══════════════════════════════════════════════════════════════════════════════

export default function CareerPage() {
  return (
    <>
      <style>{`
        #career-mobile  { display: block; }
        #career-desktop { display: none;  }
        @media (min-width: 1024px) {
          #career-mobile  { display: none;  }
          #career-desktop { display: block; }
        }
      `}</style>
      <MobilePage />
      <DesktopPage />
    </>
  );
}
