'use client';

import './AchievementsFacts.css';
import Achievements from './Achievements';
import KeyFacts from './KeyFacts';

/** Step 2: designer Achievements + KeyFacts (replaces old Achievements + Stats). */
export default function AchievementsFacts() {
  return (
    <>
      <Achievements />
      <KeyFacts />
    </>
  );
}
