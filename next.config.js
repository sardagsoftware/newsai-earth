/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ["openweathermap.org"],
  },
};

module.exports = nextConfig;
