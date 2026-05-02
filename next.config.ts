import "./src/env.js";
import type { NextConfig } from "next";

const config: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.4.100"],
  images: {},
};

export default config;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();
