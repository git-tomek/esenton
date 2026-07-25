// Post-processes gltfjsx output so it compiles in this repo.
//
// gltfjsx@6.5.x emits code with three known issues:
// 1. `GLTFAction` is referenced but never defined when the model has no animations.
// 2. `JSX.IntrinsicElements` no longer exists as a global namespace in React 19.
// 3. The `as GLTFResult` cast needs `as unknown as` under strict TS.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL(
  '../src/components/three/hero/HeroModel.generated.tsx',
  import.meta.url,
);

let code = readFileSync(FILE, 'utf8');

if (!code.startsWith('/* eslint-disable */')) {
  code = `/* eslint-disable */\n// Generated file — do not edit. Regenerate with \`npm run model:codegen\`.\n${code}`;
}

code = code
  .replace('animations: GLTFAction[]', 'animations: THREE.AnimationClip[]')
  .replace("JSX.IntrinsicElements['group']", "ThreeElements['group']")
  .replace(') as GLTFResult', ') as unknown as GLTFResult');

if (!code.includes("import type { ThreeElements }")) {
  code = code.replace(
    "import { GLTF } from 'three-stdlib'",
    "import { GLTF } from 'three-stdlib'\nimport type { ThreeElements } from '@react-three/fiber'",
  );
}

writeFileSync(FILE, code);
console.log('fixed gltfjsx output:', FILE.pathname);
