'use client';

import type { CSSProperties } from 'react';
import styles from './HeroLoader.module.scss';

/*
Presentational loader shown over the hero canvas while the 3D scene loads.
Intentionally dependency-free (no three/drei) so it stays cheap in the main
bundle and can render during the JS-bundle download phase, before the heavy
HeroScene chunk arrives. Progress is supplied by the caller:
  - `indeterminate` → spinning arc (unknown JS-bundle download phase)
  - `progress` 0–100 → determinate ring (drei useProgress asset phase)
*/

interface HeroLoaderProps {
  /** 0–100 asset-load progress. Ignored when `indeterminate`. */
  progress?: number;
  /** Spinner mode for the JS-bundle download phase (no measurable progress). */
  indeterminate?: boolean;
  /** Fade + scale out once loading is complete (kept mounted for the transition). */
  hidden?: boolean;
}

export function HeroLoader({
  progress = 0,
  indeterminate = false,
  hidden = false,
}: HeroLoaderProps) {
  const value = Math.round(Math.min(100, Math.max(0, progress)));
  // The conic ring reads this as a percentage. A fixed 25% arc spins in
  // indeterminate mode; otherwise it tracks the real progress value.
  const ringStyle = {
    '--hl-progress': indeterminate ? 25 : value,
  } as CSSProperties;

  return (
    <div
      className={`${styles.root} ${hidden ? styles.hidden : ''}`}
      aria-hidden
    >
      <div className={styles.badge}>
        <div
          className={`${styles.ring} ${indeterminate ? styles.spin : ''}`}
          style={ringStyle}
        >
          {!indeterminate && <span className={styles.value}>{value}%</span>}
        </div>
        <span className={styles.label}>
          {indeterminate ? 'Uruchamianie' : 'Ładowanie przestrzeni'}
          <span className={styles.dots} aria-hidden />
        </span>
      </div>
    </div>
  );
}
