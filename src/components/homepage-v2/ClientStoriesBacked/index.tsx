'use client';

import './ClientStoriesBacked.css';
import ClientStories from './ClientStories';
import Backed from './Backed';

/** Step 3: designer ClientStories + Backed (replaces old Gallery + SocialProof). */
export default function ClientStoriesBacked() {
  return (
    <>
      <ClientStories />
      <Backed />
    </>
  );
}
