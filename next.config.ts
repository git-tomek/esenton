import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  sassOptions: {
    loadPaths: [path.join(process.cwd(), 'src/styles')],
  },
};

export default nextConfig;
