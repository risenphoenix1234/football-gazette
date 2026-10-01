/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      // NewsData.io articles pull images from many different publisher
      // domains we can't predict in advance — allow any https host.
      // (Only affects next/image's optimizer; doesn't grant any other access.)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;