/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org",
      "images.pexels.com",
      "replicate.delivery",
    ],
  },
};

export default nextConfig;
