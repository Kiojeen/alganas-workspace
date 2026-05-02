import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDB } from "@/server/db";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(await getDB(), {
    provider: "sqlite", // or "pg" or "mysql"
  }),
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {},

  telemetry: {
    debug: false,
  },
});

export type Session = typeof auth.$Infer.Session;
