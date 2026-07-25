'use client';

import dynamic from 'next/dynamic';
import useMediaQuery from '@mui/material/useMediaQuery';

import styles from '@/components/sections/HeroSection.module.scss';
import { HeroLoader } from './HeroLoader';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  // Shown while the heavy scene chunk downloads — no measurable progress yet,
  // so spin. HeroScene then swaps in the determinate asset-load progress.
  loading: () => <HeroLoader indeterminate />,
});

export function HeroCanvas() {
  // Three.js renders only on desktop (>= lg). Mobile + tablet get a static
  // hero image instead, so the heavy 3D bundle never loads there.
  // Default (noSsr: false) keeps SSR and first client render in sync, then
  // swaps to the canvas after mount on desktop — avoids hydration mismatch.
  const isDesktop = useMediaQuery('(min-width:1200px)');

  return (
    <div className={styles.canvasLayer} aria-hidden>
      {isDesktop ? <HeroScene /> : <div className={styles.heroPlaceholder} />}
    </div>
  );
}
