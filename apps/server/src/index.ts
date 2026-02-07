import { createContext } from "@example-kakeibo-app/api/context";
import { appRouter } from "@example-kakeibo-app/api/routers/index";
import { auth } from "@example-kakeibo-app/auth";
import { env } from "@example-kakeibo-app/env/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ORPCError, ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Better Auth ハンドラー
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// OpenAPI ハンドラー（Scalar + REST 互換用）
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    async (options) => {
      try {
        return await options.next();
      } catch (error) {
        // バリデーションエラーを 422 に変換
        if (
          error instanceof ORPCError &&
          error.code === "BAD_REQUEST" &&
          error.cause instanceof ValidationError
        ) {
          throw new ORPCError("BAD_REQUEST", {
            status: 422,
            message: "バリデーションエラー",
            data: { issues: error.cause.issues },
            cause: error.cause,
          });
        }
        console.error(error);
        throw error;
      }
    },
  ],
});

// RPC ハンドラー（フロントエンド通信用）
const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    async (options) => {
      try {
        return await options.next();
      } catch (error) {
        if (
          error instanceof ORPCError &&
          error.code === "BAD_REQUEST" &&
          error.cause instanceof ValidationError
        ) {
          throw new ORPCError("BAD_REQUEST", {
            status: 422,
            message: "バリデーションエラー",
            data: { issues: error.cause.issues },
            cause: error.cause,
          });
        }
        console.error(error);
        throw error;
      }
    },
  ],
});

// /rpc/* → RPC、/api/* → OpenAPI の両方をハンドル
app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api",
    context,
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

// Scalar API ドキュメント
app.get(
  "/docs",
  Scalar({
    theme: "purple",
    pageTitle: "Example Kakeibo API",
    url: "/api/spec.json",
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
