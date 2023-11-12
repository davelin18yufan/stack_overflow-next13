/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true /*  Compile MDX files using the new Rust compiler. */,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    // import image from outside
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
}

module.exports = nextConfig
