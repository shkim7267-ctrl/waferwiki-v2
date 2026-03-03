/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const withBasePath = basePath.length > 0;

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  ...(withBasePath ? { basePath, assetPrefix: basePath } : {})
};

export default nextConfig;
