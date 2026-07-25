import * as THREE from 'three';

/*
Texture pipeline (per-mesh Cycles bakes):
Every textured node in hero.glb has its own `/textures/<node>__CyclesBake_COMBINED.jpg`
authored on TEXCOORD_0. Those images are generated from PNG masters (in /textures-src)
by `scripts/optimize-textures.mjs` (per-texture resolution + quality map, wired into
prebuild): JPEG for opaque bakes, PNG for the chair alpha mask. COMBINED bakes already
contain lighting, so those meshes render unlit (kind: 'unlit', MeshBasicMaterial).
Meshes without a bake (paper pages, pen, macstudio light) get simple lit materials;
`coffee` and `desk_top` use DIFFUSE (+ AO for desk_top) bakes so the scene lights can
shade them.

Each mesh is mapped to a material by its node name via MESH_ASSIGNMENTS. An assignment's
`kind` selects the material type and the props that apply to it:
  - 'unlit'    → MeshBasicMaterial    (bake rendered as-authored, no scene lighting)
  - 'lit'      → MeshStandardMaterial (shaded by StudioLights; optional map/aoMap/emissive)
  - 'physical' → MeshPhysicalMaterial (transmission/clearcoat — glass, porcelain)
  - 'alpha'    → MeshStandardMaterial with an alpha mask (chair mesh)

Model loading/preload lives in HeroModel.generated.tsx (gltfjsx output).
*/

const TEXTURES_BASE = '/textures';
const ASSETS_BASE = '/assets';

const combinedBake = (name: string) =>
  `${TEXTURES_BASE}/${name}__CyclesBake_COMBINED.jpg`;

const COFFEE_DIFFUSE_MAP = `${TEXTURES_BASE}/coffee__CyclesBake_DIFFUSE.jpg`;
const DESK_TOP_DIFFUSE_MAP = `${TEXTURES_BASE}/desk_top__CyclesBake_DIFFUSE.jpg`;
const DESK_TOP_AO_MAP = `${TEXTURES_BASE}/desk_top__PBR_Ambient Occlusion.jpg`;
const CHAIR_MESH_ALPHA_MAP = `${TEXTURES_BASE}/chair_mesh_PBR_Alpha.png`;

// Blender-only helper geometry that must never render. Names listed here are
// hidden in HeroModel's traverse pass (e.g. light blockers, bake cages).
export const HIDDEN_MESHES = new Set<string>();

// Meshes whose texture should be remapped to exactly fill the mesh's UV bounds,
// so the whole image is visible regardless of how the UVs were laid out.
export const FIT_TEXTURE_MESHES = new Set(['screen1', 'screen2']);

// Nodes with their own COMBINED bake — rendered unlit (kind: 'unlit').
const BAKED_MESHES = [
  'microphone',
  'monitor1',
  'pen',
  'podstawka1',
  'monitor2',
  'podstawka2',
  'notebook',
  'mouse',
  'mousepad',
  'headphones',
  'webcam',
  'Apple_MK_power',
  'Apple_MK_buttons',
  'macbook',
  'macstudio',
  'chair_arms',
  'chair_seat',
  'chair_bottom',
  'chair_wheels',
] as const;

// Per-mesh flat emissive lifts (lit kind) for small bakes that read too dark in
// the scene lighting. The value sets a low white `emissiveIntensity`.
const BAKED_EMISSIVE: Partial<Record<(typeof BAKED_MESHES)[number], number>> = {
  mouse: 0.015,
  mousepad: 0.01,
  headphones: 0.015,
  pen: 0.02,
  Apple_MK_power: 0.05,
};

type Names = readonly string[];

/** Unlit bake — MeshBasicMaterial, rendered exactly as authored (no lighting). */
type UnlitAssignment = {
  kind: 'unlit';
  names: Names;
  /** COMBINED bake or screen capture. Omit for a flat colour-only surface. */
  map?: string;
  /** Multiplies the map/base colour (e.g. dim a too-bright bake). */
  color?: string;
  /** Skip tone mapping — keeps screens at full display brightness. */
  toneMapped?: boolean;
};

/** Lit surface — MeshStandardMaterial shaded by the scene lights. */
type LitAssignment = {
  kind: 'lit';
  names: Names;
  /** DIFFUSE/COMBINED bake used as the albedo map. */
  map?: string;
  /** PBR ambient-occlusion bake (NoColorSpace). Requires TEXCOORD_0. */
  aoMap?: string;
  /** Reuse `map` as an emissiveMap to lift brightness (pair with emissiveIntensity). */
  emissiveMap?: boolean;
  color?: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

/** Glazed surface — MeshPhysicalMaterial (porcelain, glass). */
type PhysicalAssignment = {
  kind: 'physical';
  names: Names;
  color?: string;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  specularIntensity?: number;
  ior?: number;
  transmission?: number;
  thickness?: number;
  transparent?: boolean;
  attenuationColor?: string;
  attenuationDistance?: number;
};

/** Cut-out surface — MeshStandardMaterial driven by an alpha-mask bake. */
type AlphaAssignment = {
  kind: 'alpha';
  names: Names;
  map: string;
  alphaTest: number;
  color: string;
};

type MeshAssignment =
  | UnlitAssignment
  | LitAssignment
  | PhysicalAssignment
  | AlphaAssignment;

const MESH_ASSIGNMENTS: MeshAssignment[] = [
  // --- Unlit bakes (rendered as authored in Blender) ---------------------
  { kind: 'unlit', names: ['wall'], map: combinedBake('wall') },
  { kind: 'unlit', names: ['iphone'], map: combinedBake('iphone') },
  { kind: 'unlit', names: ['paper'], map: combinedBake('paper'), color: '#DCDCDB' },
  // Monitor displays — UI screen captures, unlit so they read as self-lit
  // glowing screens (not authored COMBINED bakes).
  { kind: 'unlit', names: ['screen1'], map: `${ASSETS_BASE}/screen1.jpg`, toneMapped: false },
  { kind: 'unlit', names: ['screen2'], map: `${ASSETS_BASE}/screen2.jpg`, toneMapped: false },
  // -15% brightness via colour multiplier, matte like real paper.
  { kind: 'unlit', names: ['page_top_left'], map: combinedBake('page_top_left'), color: '#d9d9d9' },
  { kind: 'unlit', names: ['page_top_right'], map: combinedBake('page_top_right'), color: '#d9d9d9' },
  // Plain notebook pages — unlit to match the brightness of the baked pages.
  { kind: 'unlit', names: ['page_left', 'page_right'], color: '#E0E1E1' },

  // --- COMBINED bakes that need scene shading or an emissive lift --------
  ...BAKED_MESHES.map((name): LitAssignment => {
    const emissiveIntensity = BAKED_EMISSIVE[name];
    return {
      kind: 'lit',
      names: [name],
      map: combinedBake(name),
      ...(emissiveIntensity !== undefined && {
        emissive: '#ffffff',
        emissiveIntensity,
      }),
    };
  }),

  // --- Lit surfaces (shaded by StudioLights) -----------------------------
  // Liquid coffee — diffuse bake shaded by the studio lights.
  { kind: 'lit', names: ['coffee'], map: COFFEE_DIFFUSE_MAP, roughness: 0.25 },
  // Wood desk — diffuse colour plus baked AO.
  // NOTE: the AO bake is authored on a scene-wide lightmap atlas UV, but this
  // mesh only has TEXCOORD_0 (the wood-plank unwrap from the DIFFUSE bake).
  // Re-bake AO on TEXCOORD_0 for it to map correctly.
  {
    kind: 'lit',
    names: ['desk_top'],
    map: DESK_TOP_DIFFUSE_MAP,
    aoMap: DESK_TOP_AO_MAP,
    roughness: 0.88,
  },
  // Printer — its COMBINED bake is dark/flat in scene light, so reuse it as an
  // emissiveMap to lift brightness while preserving texture detail.
  {
    kind: 'lit',
    names: ['printer'],
    map: combinedBake('printer'),
    emissiveMap: true,
    emissive: '#ffffff',
    emissiveIntensity: 0.7,
  },
  // Chair back — dark grey matte plastic (no bake).
  { kind: 'lit', names: ['chair_back'], color: '#2a2b2e', roughness: 0.9 },
  // Notebook back covers — matte black plastic.
  { kind: 'lit', names: ['page_bottom_left', 'page_bottom_right'], color: '#1a1a1c', roughness: 0.88 },
  // Mac Studio power LED — the only mesh bright enough to bloom.
  {
    kind: 'lit',
    names: ['macstudio_light'],
    color: '#eef4ff',
    emissive: '#cfe2ff',
    emissiveIntensity: 1.4,
    roughness: 0.4,
  },

  // --- Glass / cut-out ---------------------------------------------------
  // Clear glass mug — translucent, soft highlights only (no HDR mirror).
  {
    kind: 'physical',
    names: ['mug'],
    color: '#f6f8fc',
    roughness: 0.14,
    metalness: 0,
    transmission: 0.92,
    thickness: 0.18,
    ior: 1.45,
    envMapIntensity: 0,
    specularIntensity: 0.32,
    transparent: true,
    attenuationColor: '#eef2f8',
    attenuationDistance: 3,
  },
  { kind: 'alpha', names: ['chair_mesh'], map: CHAIR_MESH_ALPHA_MAP, alphaTest: 0.12, color: '#4f5560' },
];

/** Texture URLs an assignment needs loaded, in a stable order. */
function assignmentTextureUrls(assignment: MeshAssignment): string[] {
  switch (assignment.kind) {
    case 'unlit':
      return assignment.map ? [assignment.map] : [];
    case 'lit':
      return [assignment.map, assignment.aoMap].filter(
        (url): url is string => Boolean(url),
      );
    case 'alpha':
      return [assignment.map];
    case 'physical':
      return [];
  }
}

export const TEXTURE_URLS = [
  ...new Set(MESH_ASSIGNMENTS.flatMap(assignmentTextureUrls)),
];

/**
 * Configures a bake texture in place (idempotent). All bakes are authored on
 * TEXCOORD_0. Colour maps use sRGB; data maps (AO) use NoColorSpace.
 * Trilinear mipmaps + max anisotropy keep text/detail crisp at grazing angles.
 */
function configureTexture(
  tex: THREE.Texture,
  colorSpace: THREE.ColorSpace,
  anisotropy: number,
) {
  tex.flipY = false;
  tex.channel = 0;
  tex.colorSpace = colorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  if (anisotropy > 0) {
    tex.anisotropy = anisotropy;
  }
  tex.needsUpdate = true;
}

type MaterialBuilder = (
  assignment: MeshAssignment,
  resolve: (url: string) => THREE.Texture,
  anisotropy: number,
) => THREE.Material;

const BUILDERS: Record<MeshAssignment['kind'], MaterialBuilder> = {
  unlit: (a, resolve, anisotropy) => {
    const assignment = a as UnlitAssignment;
    const map = assignment.map ? resolve(assignment.map) : null;
    if (map) configureTexture(map, THREE.SRGBColorSpace, anisotropy);
    return new THREE.MeshBasicMaterial({
      ...(map && { map }),
      color: assignment.color ?? '#ffffff',
      toneMapped: assignment.toneMapped ?? true,
    });
  },

  lit: (a, resolve, anisotropy) => {
    const assignment = a as LitAssignment;
    const map = assignment.map ? resolve(assignment.map) : null;
    if (map) configureTexture(map, THREE.SRGBColorSpace, anisotropy);
    const material = new THREE.MeshStandardMaterial({
      ...(map && { map }),
      ...(map && assignment.emissiveMap && { emissiveMap: map }),
      color: assignment.color ?? '#ffffff',
      roughness: assignment.roughness ?? 1,
      metalness: assignment.metalness ?? 0,
      emissive: assignment.emissive ?? '#000000',
      emissiveIntensity: assignment.emissiveIntensity ?? 0,
    });
    if (assignment.aoMap) {
      const aoMap = resolve(assignment.aoMap);
      configureTexture(aoMap, THREE.NoColorSpace, anisotropy);
      material.aoMap = aoMap;
    }
    return material;
  },

  physical: (a) => {
    const assignment = a as PhysicalAssignment;
    return new THREE.MeshPhysicalMaterial({
      color: assignment.color ?? '#ffffff',
      roughness: assignment.roughness ?? 0.2,
      metalness: assignment.metalness ?? 0,
      envMapIntensity: assignment.envMapIntensity ?? 0.2,
      specularIntensity: assignment.specularIntensity ?? 0.5,
      ior: assignment.ior ?? 1.5,
      transmission: assignment.transmission ?? 0,
      thickness: assignment.thickness ?? 0,
      transparent: assignment.transparent ?? assignment.transmission !== undefined,
      ...(assignment.attenuationColor && {
        attenuationColor: new THREE.Color(assignment.attenuationColor),
      }),
      ...(assignment.attenuationDistance !== undefined && {
        attenuationDistance: assignment.attenuationDistance,
      }),
    });
  },

  alpha: (a, resolve, anisotropy) => {
    const assignment = a as AlphaAssignment;
    const map = resolve(assignment.map);
    configureTexture(map, THREE.SRGBColorSpace, anisotropy);
    return new THREE.MeshStandardMaterial({
      map,
      alphaMap: map,
      color: assignment.color,
      alphaTest: assignment.alphaTest,
      transparent: true,
      metalness: 0,
      roughness: 0.88,
      emissive: '#14161a',
      emissiveIntensity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
  },
};

/**
 * Builds one shared material per assignment group, keyed by mesh node name.
 * Textures come from the drei `useTexture` cache (passed in array order matching
 * TEXTURE_URLS) and are configured in place, so only the materials need disposal
 * by the caller. `maxAnisotropy` should come from `gl.capabilities.getMaxAnisotropy()`.
 */
export function buildMaterialsByName(
  textures: THREE.Texture[],
  maxAnisotropy = 1,
): Record<string, THREE.Material> {
  const textureByUrl = new Map(
    TEXTURE_URLS.map((url, index) => [url, textures[index]]),
  );
  const resolve = (url: string) => textureByUrl.get(url)!;

  const materialsByName: Record<string, THREE.Material> = {};
  MESH_ASSIGNMENTS.forEach((assignment) => {
    const material = BUILDERS[assignment.kind](assignment, resolve, maxAnisotropy);
    assignment.names.forEach((name) => {
      materialsByName[name] = material;
    });
  });

  return materialsByName;
}
