// Responsive variant generator for the site's raster artwork.
//
// `next.config.ts` uses `output: 'export'` with `images.unoptimized`, so
// next/image cannot build a srcset for us — every <Image> ships its full-size
// master. The service illustrations are 1-1.5 MB PNGs displayed at ~220 CSS px,
// and the hero backdrop is a 3808px JPEG used only below the 3D breakpoint, so
// a phone was downloading roughly 18 MB of artwork to paint a few hundred
// pixels. This script pre-renders the sizes that are actually used, as WebP.
//
// Follows the same contract as optimize-textures.mjs:
//   - idempotent      — skips outputs newer than their source (mtime);
//   - master-tolerant — a missing master is skipped, so a checkout that only
//     has the committed outputs still builds;
// which makes it safe to run from `predev` / `prebuild` on every build.
//
// Usage: node scripts/optimize-images.mjs [--force]

import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public/images');
const OUT_DIR = path.join(IMAGES_DIR, 'responsive');

const FORCE = process.argv.includes('--force');

// Service card illustrations. Rendered at `min(220px, 70%)` on phones and
// `min(315px, 175%)` on desktop, so 640px covers a 2x display comfortably.
const SERVICE_WIDTHS = [320, 480, 640];

// Hero backdrop. Only used below 1200px (desktop swaps in the 3D scene), and
// the copy scrim covers the left half, so 1600px is ample even at 2x.
const HERO_WIDTHS = [640, 960, 1280, 1600];

const JOBS = [
  {
    source: 'bg-hero.jpg',
    widths: HERO_WIDTHS,
    quality: 74,
  },
  ...Array.from({ length: 12 }, (_, index) => ({
    source: `service_t_${String(index + 1).padStart(2, '0')}.png`,
    widths: SERVICE_WIDTHS,
    quality: 82,
  })),
];

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
  let generated = 0;
  let skipped = 0;
  let absent = 0;
  let sourceTotal = 0;
  let outputTotal = 0;

  for (const job of JOBS) {
    const src = path.join(IMAGES_DIR, job.source);
    const srcStat = await statOrNull(src);
    const baseName = job.source.replace(/\.[^.]+$/, '');

    if (!srcStat) {
      absent += 1;
      continue;
    }

    sourceTotal += srcStat.size;

    for (const width of job.widths) {
      const out = path.join(OUT_DIR, `${baseName}-${width}.webp`);
      const outStat = await statOrNull(out);

      if (!FORCE && outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
        skipped += 1;
        outputTotal += outStat.size;
        continue;
      }

      sharp ??= (await import('sharp')).default;
      await mkdir(OUT_DIR, { recursive: true });

      await sharp(src)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: job.quality, effort: 5 })
        .toFile(out);

      const newStat = await stat(out);
      outputTotal += newStat.size;
      generated += 1;
      console.log(`  ✓ ${baseName}-${width}.webp  ${KB(newStat.size)}`);
    }
  }

  console.log(
    `images: ${generated} generated, ${skipped} up-to-date, ${absent} master-absent` +
      `  |  masters ${KB(sourceTotal)} → variants ${KB(outputTotal)}`,
  );
}

main().catch((err) => {
  console.error('optimize-images failed:', err);
  process.exit(1);
});
