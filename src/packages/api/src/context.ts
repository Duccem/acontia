import type { NextRequest } from "next/server";

import { auth } from "@acontia/auth";

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const organization = await auth.api.getFullOrganization({
    headers: req.headers,
    query: { membersLimit: 0 }
  });
  return {
    session,
    organization
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
