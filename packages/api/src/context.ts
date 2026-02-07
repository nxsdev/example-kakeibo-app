import type { Context as HonoContext } from "hono";
import { ORPCError } from "@orpc/server";

import { auth } from "@example-kakeibo-app/auth";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

/** 認証済みコンテキスト（session が保証される） */
export type AuthenticatedContext = Context & {
  session: NonNullable<Context["session"]>;
};

/** 認証を検証し、型を絞り込む */
export function assertAuth(context: Context): asserts context is AuthenticatedContext {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
}
