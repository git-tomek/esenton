'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import styles from './ContactWaves.module.scss';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;

  varying float vRadius;
  varying float vAngle;
  varying float vWave;

  void main() {
    vec3 pos = position;
    float radius = length(pos.xy);
    float angle = atan(pos.y, pos.x);

    vec2 direction = normalize(pos.xy + vec2(0.0001));
    vec2 tangent = vec2(-direction.y, direction.x);
    float primaryWave = sin(radius * 34.0 - uTime * 2.8 + sin(angle * 3.0) * 0.8);
    float secondaryWave = sin(radius * 19.0 + angle * 4.0 - uTime * 1.45);
    float envelope = smoothstep(0.06, 0.2, radius) * (1.0 - smoothstep(0.78, 1.0, radius));
    float displacement = (primaryWave * 0.026 + secondaryWave * 0.012) * envelope;

    pos.xy += direction * displacement + tangent * secondaryWave * envelope * 0.006;
    vRadius = radius;
    vAngle = angle;
    vWave = primaryWave * envelope;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * uPixelRatio;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3  uColor;
  uniform vec3  uColorAccent;
  uniform float uTime;

  varying float vRadius;
  varying float vAngle;
  varying float vWave;

  void main() {
    // Tiny, soft-edged dot.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float dotAlpha = smoothstep(0.48, 0.18, d);

    // Strong close to the corner, then fading out toward the outside.
    float coreControl = smoothstep(0.025, 0.12, vRadius);
    float radialFade = 1.0 - smoothstep(0.34, 1.0, vRadius);
    float edgeFade = 1.0 - smoothstep(0.92, 1.02, vRadius);
    float shimmer = 0.82 + sin(uTime * 1.25 + vAngle * 4.0 + vRadius * 17.0) * 0.18;
    float waveLight = 0.78 + vWave * 0.34;
    float alpha = dotAlpha * coreControl * radialFade * edgeFade * shimmer * waveLight * 0.82;

    if (alpha <= 0.001) discard;

    float colorMix = clamp(smoothstep(0.12, 0.82, vRadius) + vWave * 0.08, 0.0, 1.0);
    vec3 color = mix(uColor, uColorAccent, colorMix);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function ContactWaves() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const positions: number[] = [];
    const rings = 58;
    for (let ring = 3; ring <= rings; ring++) {
      const radius = ring / rings;
      const points = Math.max(20, Math.round(radius * 255));
      for (let point = 0; point < points; point++) {
        const angle = (point / points) * Math.PI * 2 + ring * 0.095;
        positions.push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const uniforms = {
      uTime:       { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uSize:       { value: 3 },
      uColor:      { value: new THREE.Color('#0a45db') },
      uColorAccent:{ value: new THREE.Color('#9ebaff') },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    mount.appendChild(renderer.domElement);

    function resize() {
      const { clientWidth, clientHeight } = mount!;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      const aspect = clientWidth / clientHeight;
      if (aspect >= 1) {
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
      } else {
        camera.left = -1;
        camera.right = 1;
        camera.top = 1 / aspect;
        camera.bottom = -1 / aspect;
      }
      camera.updateProjectionMatrix();
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
      if (!prefersReducedMotion) raf = requestAnimationFrame(tick);
    }

    if (prefersReducedMotion) {
      uniforms.uTime.value = 0;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}

export default ContactWaves;
