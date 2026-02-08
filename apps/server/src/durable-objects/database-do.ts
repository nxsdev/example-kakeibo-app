import { DurableObject } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import * as schema from "@example-kakeibo-app/db/schema";
import migrations from "@example-kakeibo-app/db/migrations/index";
import { createAuth } from "@example-kakeibo-app/auth";
import { appRouter } from "@example-kakeibo-app/api/routers/index";
import { createLogger } from "@example-kakeibo-app/api/logger";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ORPCError, ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

const errorInterceptor = async (options: any) => {
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
    const requestId = options.context?.requestId ?? "unknown";
    const logger = createLogger({
      requestId,
      service: "database-do",
      userId: options.context?.session?.user?.id,
    });
    logger.error(error, { event: "unhandled_error" });
    throw error;
  }
};

export class DatabaseDO extends DurableObject<Env> {
  private db;
  private auth;
  private rpcHandler;
  private apiHandler;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.db = drizzle(ctx.storage, { schema });
    this.auth = createAuth(this.db, env);

    ctx.blockConcurrencyWhile(async () => {
      await migrate(this.db, migrations);
    });

    this.rpcHandler = new RPCHandler(appRouter, {
      interceptors: [errorInterceptor],
    });

    this.apiHandler = new OpenAPIHandler(appRouter, {
      plugins: [
        new OpenAPIReferencePlugin({
          schemaConverters: [new ZodToJsonSchemaConverter()],
        }),
      ],
      interceptors: [errorInterceptor],
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

    // Better Auth ルート
    if (url.pathname.startsWith("/api/auth")) {
      return this.auth.handler(request);
    }

    // RPC / API ルート — セッション検証してからハンドラーに委譲
    const session = await this.auth.api.getSession({
      headers: request.headers,
    });

    const context = { session, db: this.db, requestId };

    // RPC ハンドラー
    const rpcResult = await this.rpcHandler.handle(request, {
      prefix: "/rpc",
      context,
    });
    if (rpcResult.matched) {
      return rpcResult.response;
    }

    // OpenAPI ハンドラー
    const apiResult = await this.apiHandler.handle(request, {
      prefix: "/api",
      context,
    });
    if (apiResult.matched) {
      return apiResult.response;
    }

    return new Response("Not Found", { status: 404 });
  }
}
