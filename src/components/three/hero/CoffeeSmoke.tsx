'use client';

import * as THREE from 'three';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { useTexture } from '@react-three/drei';

/*
Coffee smoke — Bruno Simon's "Coffee Smoke" lesson (Three.js Journey ch.32),
matching the reference shaders in external/smoke/. Single subdivided plane,
twist + gentle wind in the vertex shader, scrolling Perlin pattern with edge
fades in the fragment shader.
*/

const VERTEX_SHADER = /* glsl */ `
  uniform float     uTime;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
  }

  void main() {
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.003)
    ).r;
    // Lower than the lesson's 10.0 — our column is narrower after SMOKE_SCALE,
    // so the same angle reads as a harsh corkscrew.
    float angle = twistPerlin * 3.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind — gentler drift; pow(3) keeps the base locked to the cup rim.
    vec2 windOffset = vec2(
      texture(uPerlinTexture, vec2(0.25, uTime * 0.008)).r - 0.5,
      texture(uPerlinTexture, vec2(0.75, uTime * 0.008)).r - 0.5
    );
    windOffset *= pow(uv.y, 3.0) * 0.45;
    newPosition.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float     uTime;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  void main() {
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    // Final color
    gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// The reference geometry (0.49 × 0.9) is sized for a larger scene; this
// uniform mesh scale shrinks the whole column to fit our mug.
const SMOKE_SCALE = 0.15;

interface CoffeeSmokeProps {
  /** Position of the coffee surface in HeroModel group space. */
  position: THREE.Vector3;
}

export function CoffeeSmoke({ position }: CoffeeSmokeProps) {
  const { invalidate } = useThree();

  // Tileable Perlin noise (same asset as the reference).
  const perlinTexture = useTexture('/assets/perlin.png');
  useMemo(() => {
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;
  }, [perlinTexture]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: new THREE.Uniform(0),
          uPerlinTexture: new THREE.Uniform(perlinTexture),
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [perlinTexture],
  );

  // Same plane as the reference: base at y=0, scaled to 0.49 × 0.9 × 0.49.
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 16, 64);
    geo.translate(0, 0.5, 0);
    geo.scale(0.49, 0.9, 0.49);
    return geo;
  }, []);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
      // perlinTexture lives in drei's cache — do not dispose it here.
    },
    [material, geometry],
  );

  // Advance the animation clock and keep the demand frameloop ticking.
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    invalidate();
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      scale={SMOKE_SCALE}
    />
  );
}
