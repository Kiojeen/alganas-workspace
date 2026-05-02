import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDB } from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(await getDB(), {
    provider: "sqlite", // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {},

  telemetry: {
    debug: false,
  },
});

export type Session = typeof auth.$Infer.Session;
