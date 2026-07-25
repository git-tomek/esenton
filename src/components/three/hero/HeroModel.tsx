'use client';

import * as THREE from 'three';

import { useCursor, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { ThreeElements, ThreeEvent } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLayoutEffect, useRef, useState } from 'react';

import { CoffeeSmoke } from './CoffeeSmoke';
import { Model as HeroGltf } from './HeroModel.generated';
import { INTERACTIVE_MESHES } from './interactions';
import {
  FIT_TEXTURE_MESHES,
  HIDDEN_MESHES,
  TEXTURE_URLS,
  buildMaterialsByName,
} from './materials';

gsap.registerPlugin(useGSAP);

/*
Renders the gltfjsx-generated model (HeroModel.generated.tsx) and decorates it
at runtime: baked materials are applied by node name, helper meshes are hidden,
and meshes listed in INTERACTIVE_MESHES get hover/click behaviour. All
customization lives here, so `npm run model:codegen` can regenerate the model
file without losing anything.
*/

type HeroModelProps = ThreeElements['group'] & {
  /** Fires with the node name (e.g. "macbook") when an interactive mesh is clicked. */
  onMeshClick?: (name: string) => void;
};

// Multiplier applied to the hovered mesh's base color.
const HOVER_BRIGHTNESS = 1.12;

/** ±15% of a full turn — gentle Y-axis swivel on chair_bottom (parent of seat/back). */
const CHAIR_SWAY = 0.15 * Math.PI * 2;
const CHAIR_SWAY_DURATION = 6.325;

type ColorMaterial = THREE.Material & { color: THREE.Color };

function hasColor(material: THREE.Material | undefined): material is ColorMaterial {
  return material !== undefined && 'color' in material;
}

/**
 * Remaps a mesh's texture so the full [0,1] image maps exactly onto the mesh's
 * UV bounding box. Fixes screens whose authored UVs don't span the whole image
 * (texture would otherwise look zoomed-in, offset, or not fill the surface).
 */
function fitTextureToMeshUV(mesh: THREE.Mesh, material: THREE.Material) {
  const map = (material as THREE.MeshBasicMaterial).map;
  const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute | undefined;
  if (!map || !uv) return;

  let minU = Infinity;
  let minV = Infinity;
  let maxU = -Infinity;
  let maxV = -Infinity;
  for (let i = 0; i < uv.count; i += 1) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }

  const rangeU = maxU - minU || 1;
  const rangeV = maxV - minV || 1;

  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.repeat.set(1 / rangeU, 1 / rangeV);
  map.offset.set(-minU / rangeU, -minV / rangeV);
  map.needsUpdate = true;
}

export function HeroModel({ onMeshClick, ...props }: HeroModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<Record<string, THREE.Material>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [smokeOrigin, setSmokeOrigin] = useState<THREE.Vector3 | null>(null);

  const textures = useTexture(TEXTURE_URLS);
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);

  useCursor(hovered !== null);

  useLayoutEffect(() => {
    const materialsByName = buildMaterialsByName(
      textures,
      gl.capabilities.getMaxAnisotropy(),
    );
    materialsRef.current = materialsByName;

    groupRef.current?.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      if (HIDDEN_MESHES.has(mesh.name)) {
        mesh.visible = false;
        return;
      }

      if (!mesh.geometry.attributes.normal) {
        mesh.geometry.computeVertexNormals();
      }

      const material = materialsByName[mesh.name];
      if (material) {
        mesh.material = material;
        if (FIT_TEXTURE_MESHES.has(mesh.name)) {
          fitTextureToMeshUV(mesh, material);
        }
      }

      // Anchor smoke at the coffee liquid surface (top of the coffee mesh).
      if (mesh.name === 'coffee') {
        mesh.geometry.computeBoundingBox();
        const bbox = mesh.geometry.boundingBox!;
        // Start at the bounding-box top centre in mesh-local space.
        const top = new THREE.Vector3(
          (bbox.min.x + bbox.max.x) * 0.5,
          bbox.max.y,
          (bbox.min.z + bbox.max.z) * 0.5,
        );
        // Ensure world matrices are up to date before transforming.
        mesh.updateWorldMatrix(true, false);
        mesh.localToWorld(top); // → world space
        // Convert back to the HeroModel group's local space so the
        // <CoffeeSmoke position={...} /> element is positioned correctly
        // regardless of any transforms on the outer group.
        groupRef.current?.worldToLocal(top);
        setSmokeOrigin(top.clone());
      }
    });
    invalidate();

    return () => {
      // Textures stay in the drei cache; only the materials are ours.
      [...new Set(Object.values(materialsByName))].forEach((material) =>
        material.dispose(),
      );
    };
  }, [textures, invalidate, gl]);

  useGSAP(
    () => {
      const chairBottom = groupRef.current?.getObjectByName('chair_bottom');
      if (!chairBottom) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        chairBottom.rotation.y = 0;
        invalidate();
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          chairBottom.rotation,
          { y: -CHAIR_SWAY },
          {
            y: CHAIR_SWAY,
            duration: CHAIR_SWAY_DURATION,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            onUpdate: () => invalidate(),
          },
        );
      });

      return () => media.revert();
    },
    { dependencies: [textures, invalidate], scope: groupRef },
  );

  // Hover highlight: brighten the hovered mesh's base color slightly.
  useLayoutEffect(() => {
    if (!hovered) return;
    const material = materialsRef.current[hovered];
    if (!hasColor(material)) return;

    const originalColor = material.color.clone();
    material.color.multiplyScalar(HOVER_BRIGHTNESS);
    invalidate();

    return () => {
      material.color.copy(originalColor);
      invalidate();
    };
  }, [hovered, invalidate]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!INTERACTIVE_MESHES.has(event.object.name)) return;
    event.stopPropagation();
    setHovered(event.object.name);
  };

  const handlePointerOut = () => setHovered(null);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!INTERACTIVE_MESHES.has(event.object.name)) return;
    event.stopPropagation();
    onMeshClick?.(event.object.name);
  };

  return (
    <group
      ref={groupRef}
      {...props}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <HeroGltf />
      {smokeOrigin && <CoffeeSmoke position={smokeOrigin} />}
    </group>
  );
}
