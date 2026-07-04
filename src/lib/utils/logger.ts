type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function resolveLevel(): LogLevel {
  const env = process.env.LOG_LEVEL as LogLevel | undefined;
  if (env && env in LEVEL_PRIORITY) return env;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const MIN_LEVEL = resolveLevel();

function emit(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  const entry = {
    ts:  new Date().toISOString(),
    lvl: level.toUpperCase(),
    msg: message,
    ...(meta && Object.keys(meta).length > 0 ? { data: meta } : {}),
  };

  const line = JSON.stringify(entry);

  // Console nativo para que o Vercel capture nos Function Logs
  if      (level === "error") console.error("[ZUMBO]", line);
  else if (level === "warn")  console.warn("[ZUMBO]",  line);
  else                        console.log("[ZUMBO]",   line);
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => emit("debug", msg, meta),
  info:  (msg: string, meta?: Record<string, unknown>) => emit("info",  msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => emit("warn",  msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => emit("error", msg, meta),
};
