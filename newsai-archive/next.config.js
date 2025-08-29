/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: [
      "openweathermap.org",
      "newsai.earth",
      "images.unsplash.com",
      "pbs.twimg.com",
      "cdn.jsdelivr.net",
    ],
  },
};

module.exports = nextConfig;
