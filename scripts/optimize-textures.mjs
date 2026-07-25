// Texture optimizer for the hero 3D scene.
//
// Converts the per-mesh Cycles-bake PNG masters into web-delivered images, with
// a per-texture resolution + quality map. This solves two separate problems:
//   1. Download size — JPEG crushes these PNGs (smooth lighting gradients).
//   2. GPU VRAM — three decodes every texture to full RGBA on the GPU, so the
//      *resolution* (not the on-disk format) is what bounds VRAM. Small props
//      are downscaled aggressively because they cover little screen area.
//
// Format: JPEG for opaque bakes/screens (best compression, universal support);
// PNG for the one alpha mask (chair_mesh) since JPEG has no alpha channel.
//
// Masters live in /textures-src (gitignored — large, local only). The generated
// images go to /public and are committed; those are what gets deployed. This
// script is:
//   - idempotent  — skips outputs already newer than their source (mtime);
//   - master-tolerant — if a master is absent (e.g. a fresh CI checkout), it
//     skips silently and relies on the committed output.
// That makes it safe to run from `prebuild` on every build.
//
// Usage: node scripts/optimize-textures.mjs [--force]

import { stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'textures-src');
const OUT = {
  textures: path.join(ROOT, 'public/textures'),
  assets: path.join(ROOT, 'public/assets'),
};

const FORCE = process.argv.includes('--force');

// Quality tiers (JPEG).
const Q_BAKE = 86; // COMBINED/DIFFUSE bakes — lit gradients compress very well.
const Q_SCREEN = 90; // UI captures — keep text crisp.
const Q_DATA = 92; // AO map — non-colour data, minimise artifacts.

// Per-texture rules, keyed by source basename (no extension).
//   width   — target longest edge (never upscales)
//   quality — encoder quality
//   format  — 'jpeg' (default) | 'png' (for alpha)
//   outDir  — 'textures' (default) | 'assets'
const RULES = {
  // Large surfaces — keep 2K.
  'wall__CyclesBake_COMBINED': { width: 2048, quality: Q_BAKE },
  'desk_top__CyclesBake_DIFFUSE': { width: 2048, quality: Q_BAKE },

  // Mid devices / props — 1K.
  'monitor1__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'monitor2__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'macbook__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'macstudio__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'printer__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'mousepad__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'iphone__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'headphones__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'microphone__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'webcam__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'notebook__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'podstawka1__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'podstawka2__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'Apple_MK_power__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'Apple_MK_buttons__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'chair_seat__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'chair_arms__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'chair_bottom__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'chair_wheels__CyclesBake_COMBINED': { width: 1024, quality: Q_BAKE },
  'coffee__CyclesBake_DIFFUSE': { width: 1024, quality: Q_BAKE },

  // Small props — 512 (thin/low screen-area objects).
  'pen__CyclesBake_COMBINED': { width: 512, quality: Q_BAKE },
  'mouse__CyclesBake_COMBINED': { width: 512, quality: Q_BAKE },
  'paper__CyclesBake_COMBINED': { width: 512, quality: Q_BAKE },
  'page_top_left__CyclesBake_COMBINED': { width: 512, quality: Q_BAKE },
  'page_top_right__CyclesBake_COMBINED': { width: 512, quality: Q_BAKE },

  // Non-colour AO data map — JPEG at high quality, full chroma.
  'desk_top__PBR_Ambient Occlusion': { width: 1024, quality: Q_DATA },

  // Alpha mask — must stay PNG (JPEG has no alpha).
  'chair_mesh_PBR_Alpha': { width: 1024, format: 'png' },

  // Screens — keep near-native width for crisp UI text.
  screen1: { width: 1672, quality: Q_SCREEN, outDir: 'assets' },
  screen2: { width: 1672, quality: Q_SCREEN, outDir: 'assets' },
};

const EXT = { jpeg: 'jpg', png: 'png' };
const KB = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function statOrNull(file) {
  try {
    return await stat(file);
  } catch {
    return null;
  }
}

async function main() {
  let sharp;
  const results = [];
  let srcTotal = 0;
  let outTotal = 0;
  let generated = 0;
  let skipped = 0;
  let absent = 0;

  for (const [name, rule] of Object.entries(RULES)) {
    const format = rule.format ?? 'jpeg';
    const outDir = OUT[rule.outDir ?? 'textures'];
    const src = path.join(SRC_DIR, `${name}.png`);
    const out = path.join(outDir, `${name}.${EXT[format]}`);

    const srcStat = await statOrNull(src);
    if (!srcStat) {
      // No master locally — rely on the committed output. Only warn if the
      // output is also missing (then the scene would 404 this texture).
      if (!(await statOrNull(out))) {
        console.warn(`  ⚠ ${name}: master AND output missing`);
      }
      absent += 1;
      continue;
    }

    const outStat = await statOrNull(out);
    if (!FORCE && outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped += 1;
      srcTotal += srcStat.size;
      outTotal += outStat.size;
      continue;
    }

    sharp ??= (await import('sharp')).default;
    await mkdir(outDir, { recursive: true });

    const pipeline = sharp(src).resize(rule.width, rule.width, {
      fit: 'inside',
      withoutEnlargement: true,
    });
    if (format === 'png') {
      pipeline.png({ compressionLevel: 9 });
    } else {
      pipeline.jpeg({
        quality: rule.quality,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
      });
    }
    await pipeline.toFile(out);

    const newOut = await stat(out);
    srcTotal += srcStat.size;
    outTotal += newOut.size;
    generated += 1;
    results.push({ name, width: rule.width, from: srcStat.size, to: newOut.size });
  }

  for (const r of results) {
    const ratio = (r.from / r.to).toFixed(0);
    console.log(`  ✓ ${r.name} @${r.width}  ${KB(r.from)} → ${KB(r.to)}  (${ratio}×)`);
  }

  console.log(
    `textures: ${generated} generated, ${skipped} up-to-date, ${absent} master-absent` +
      `  |  ${KB(srcTotal)} → ${KB(outTotal)}`,
  );
}

main().catch((err) => {
  console.error('optimize-textures failed:', err);
  process.exit(1);
});
