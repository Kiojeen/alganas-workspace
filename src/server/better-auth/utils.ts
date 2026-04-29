import "server-only";

import { redirect } from "next/navigation";

import { getSession } from "./server";

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireUnauth() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return session;
}
