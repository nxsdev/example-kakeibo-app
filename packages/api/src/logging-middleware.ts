import { o } from "./index";
import { createLogger } from "./logger";

export const loggingMiddleware = o.middleware(
  async ({ context, path, next }) => {
    const operation = path.join(".");
    const logger = createLogger({
      requestId: context.requestId ?? "unknown",
      service: "database-do",
      userId: context.session?.user?.id,
      operation,
    });
    logger.info({ event: "start" });
    const start = Date.now();
    try {
      const result = await next({ context: { logger } });
      logger.info({ event: "end", duration_ms: Date.now() - start });
      return result;
    } catch (error) {
      logger.error(error, { event: "error", duration_ms: Date.now() - start });
      throw error;
    }
  },
);
