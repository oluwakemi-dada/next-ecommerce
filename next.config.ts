import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const isAnalyze = process.env.ANALYZE === 'true';

// Enable analyzer when ANALYZE env variable is true
const bundleAnalyzer = withBundleAnalyzer({
  enabled: isAnalyze,
  analyzerMode: 'static', // generates a static HTML file
  openAnalyzer: false, // don't open tabs automatically
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
