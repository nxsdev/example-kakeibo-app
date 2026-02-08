type LogLevel = "info" | "warn" | "error" | "debug";

type BaseFields = {
  requestId: string;
  service: string;
  userId?: string;
  operation?: string;
};

function emit(
  level: LogLevel,
  base: BaseFields,
  payload: Record<string, unknown>,
) {
  const entry = { level, ...base, ...payload, timestamp: Date.now() };
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.log(entry);
}

export function createLogger(base: BaseFields) {
  return {
    info: (p: Record<string, unknown> = {}) => emit("info", base, p),
    warn: (p: Record<string, unknown> = {}) => emit("warn", base, p),
    error: (error: unknown, p: Record<string, unknown> = {}) => {
      const errorInfo =
        error instanceof Error
          ? {
              error_name: error.name,
              error_message: error.message,
              stack: error.stack,
            }
          : { error_message: String(error) };
      emit("error", base, { ...errorInfo, ...p });
    },
  };
}

export type Logger = ReturnType<typeof createLogger>;
