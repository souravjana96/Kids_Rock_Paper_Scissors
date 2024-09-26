/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "news.stanford.edu",
      "images.squarespace-cdn.com",
      "opendatascience.com",
      "miro.medium.com",
      "images.unsplash.com",
      "images.pexels.com",
      "www.skyscanner.net",
    ],
  },
};

export default nextConfig;
