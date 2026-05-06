/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.4.100"],
  images: {
    remotePatterns: [new URL(`${env.NEXT_PUBLIC_R2_PUBLIC_URL}/**`)],
  },
};

export default config;
