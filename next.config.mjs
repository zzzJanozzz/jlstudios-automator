// next.config.mjs
// ─────────────────────────────────────────────────────────────────────────────
// FIXED: bodySizeLimit must be on the `api` key, not `serverActions`.
// Also added explicit serverExternalPackages to prevent bundling issues.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── API body size limit ────────────────────────────────────────────────────
  // This controls the request body size for ALL /api/* routes.
  // Without this, Next defaults to 4 MB and throws a 413 before the route
  // handler even runs — and that 413 was never caught by the client.
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
    responseLimit: false, // Don't limit response size
  },

  // ── Experimental (if using App Router with server actions) ─────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },

  // ── External packages that must NOT be bundled ─────────────────────────────
  // This prevents "Module not found" errors for native Node modules used
  // by Gemini SDK or other AI clients.
  serverExternalPackages: ["@google/generative-ai"],

  // ── Image config (if using next/image with base64 data URIs) ───────────────
  images: {
    dangerouslyAllowSVG: false,
    remotePatterns: [],
  },

  // ── Silence noisy webpack warnings from AI SDK ─────────────────────────────
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent "Critical dependency" warnings from dynamic requires in AI SDKs
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        "@google/generative-ai",
      ].filter(Boolean);
    }
    return config;
  },
};

export default nextConfig;
