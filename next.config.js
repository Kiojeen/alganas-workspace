import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import "./src/env.js";

// Initialize the Cloudflare dev platform immediately
initOpenNextCloudflareForDev();

/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.4.100"],
  images: {},
};

export default config;
