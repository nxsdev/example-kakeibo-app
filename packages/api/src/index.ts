import { os } from "@orpc/server";

import type { Context } from "./context";

/** oRPC ビルダー（コンテキスト付き） */
export const o = os.$context<Context>();

/** 認証不要のプロシージャ */
export const publicProcedure = o;
