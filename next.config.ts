import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin workspace root when a parent directory also has a lockfile (e.g. home folder)
  turbopack: { root: projectRoot },
};

export default nextConfig;
