/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    mdxRs: true /*  Compile MDX files using the new Rust compiler. */,
    serverComponentsExternalPackages: ["mongoose"],
  },
}

module.exports = nextConfig
