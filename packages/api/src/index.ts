import { os, ORPCError } from "@orpc/server";

import type { Context } from "./context";

/** oRPC ビルダー（コンテキスト付き） */
export const o = os.$context<Context>();

/** 認証不要のプロシージャ */
export const publicProcedure = o;

/** 認証ミドルウェア — session を検証してコンテキストを絞り込む */
export const authMiddleware = o.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({ context: { session: context.session } });
});

export { loggingMiddleware } from "./logging-middleware";
