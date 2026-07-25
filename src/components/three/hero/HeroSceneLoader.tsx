'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

import { HeroLoader } from './HeroLoader';

/*
Drives the hero loader from drei's loading manager (GLB model, textures, HDRI
all load through it). Renders as a sibling of <Canvas> inside HeroScene. Once
progress hits 100% it fades out, then unmounts after the transition so it never
intercepts pointer events on the finished scene.
*/

// Matches the .root opacity transition in HeroLoader.module.scss.
const FADE_OUT_MS = 700;

export function HeroSceneLoader() {
  const { progress } = useProgress();
  const done = progress >= 100;
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setUnmounted(true), FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [done]);

  if (unmounted) return null;

  return <HeroLoader progress={progress} hidden={done} />;
}
