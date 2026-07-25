"use client";

import "@/components/three/lib/suppressClockWarning";

import * as THREE from "three";

import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
} from "@react-three/postprocessing";
import {
  CAMERA_FOV,
  CAMERA_POSITION,
  ORBIT_LIMITS,
  ORBIT_TARGET,
} from "./camera";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { HeroModel } from "./HeroModel";
import { HeroSceneLoader } from "./HeroSceneLoader";
import { StudioLights } from "./Lights";
import { Suspense } from "react";
import { WebGLContextGuard } from "@/components/three/lib/WebGLContextGuard";

const ENVIRONMENT_HDR = "/hdri/studio_small_03_1k.hdr";

export default function HeroScene() {
  return (
    <>
      <Canvas
      // Static scene: render only when OrbitControls invalidates.
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: "high-performance",
      }}
    >
      <WebGLContextGuard />
      <PerspectiveCamera
        makeDefault
        position={CAMERA_POSITION}
        fov={CAMERA_FOV}
        near={0.1}
        far={1000}
      />

      <OrbitControls
        target={ORBIT_TARGET}
        minAzimuthAngle={ORBIT_LIMITS.minAzimuth}
        maxAzimuthAngle={ORBIT_LIMITS.maxAzimuth}
        minPolarAngle={ORBIT_LIMITS.polar}
        maxPolarAngle={ORBIT_LIMITS.polar}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />

      <StudioLights />

      <Suspense fallback={null}>
        <HeroModel />
        <Environment files={ENVIRONMENT_HDR} environmentIntensity={0.25} />
        <EffectComposer>
          {/* Only the LED strip (emissive 3) blooms — threshold above scene whites. */}
          <Bloom
            mipmapBlur
            luminanceThreshold={0.8}
            intensity={0.7}
            radius={0.5}
          />
          {/* Cut the foggy grey haze: lift contrast, boost saturation slightly. */}
          <BrightnessContrast brightness={0} contrast={0.05} />
          <HueSaturation hue={0} saturation={0.25} />
        </EffectComposer>
      </Suspense>
      </Canvas>
      <HeroSceneLoader />
    </>
  );
}
