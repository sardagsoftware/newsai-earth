/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
