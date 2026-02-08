import { env } from "@example-kakeibo-app/env/server";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createLogger } from "@example-kakeibo-app/api/logger";

// Durable Object クラスを re-export（Cloudflare に登録させるため）
export { DatabaseDO } from "./durable-objects/database-do";

type AppVariables = { Variables: { requestId: string } };

const app = new Hono<AppVariables>();

// requestId ミドルウェア: ヘッダから取得 or 新規生成
app.use(async (c, next) => {
  const requestId =
    c.req.header("x-request-id") ?? crypto.randomUUID();
  c.set("requestId", requestId);
  c.header("x-request-id", requestId);
  await next();
});

// 構造化ロギングミドルウェア
app.use(async (c, next) => {
  const requestId = c.get("requestId") as string;
  const logger = createLogger({
    requestId,
    service: "server",
    operation: `${c.req.method} ${c.req.path}`,
  });
  logger.info({ event: "request" });
  const start = Date.now();
  await next();
  logger.info({
    event: "response",
    status: c.res.status,
    duration_ms: Date.now() - start,
  });
});

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-request-id"],
    credentials: true,
  }),
);

// ヘルスチェック
app.get("/", (c) => c.text("OK"));

// Scalar API ドキュメント
app.get(
  "/docs",
  Scalar({
    theme: "purple",
    pageTitle: "Example Kakeibo API",
    url: "/api/spec.json",
  }),
);

// 全API/RPCリクエスト → DatabaseDO に転送
app.on(["POST", "GET", "PATCH", "DELETE"], "/api/*", forwardToDO);
app.on(["POST", "GET", "PATCH", "DELETE"], "/rpc/*", forwardToDO);

async function forwardToDO(c: any): Promise<Response> {
  const id = env.DATABASE_DO.idFromName("database");
  // @ts-expect-error -- DurableObjectNamespace type instantiation is excessively deep
  const stub = env.DATABASE_DO.get(id);
  const original = c.req.raw.clone();
  original.headers.set("x-request-id", c.get("requestId"));
  return stub.fetch(original);
}

export default app;
