'use client';

import { useState } from 'react';
import { pauseOtherVideos } from './pauseOtherVideos';

/** Wires one MediaVideo instance into the page-wide single-player policy. */
export function usePlayableVideo() {
  const [playing, setPlaying] = useState(false);
  const handlePlay = () => {
    pauseOtherVideos();
    setPlaying(true);
  };
  return { playing, handlePlay };
}
