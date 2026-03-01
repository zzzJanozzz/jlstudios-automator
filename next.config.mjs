/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Mantiene tu configuración de imágenes original
  images: {
    remotePatterns: [],
  },
  // 2. Aumenta el límite de carga del servidor para evitar el Error 413
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;