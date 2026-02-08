import { implement } from "@orpc/server";
import { dashboardContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { authMiddleware, loggingMiddleware } from "../../index";
import { handleDashboardSummary } from "./summary.handler";
import { handleDashboardByCategory } from "./by-category.handler";

/** ダッシュボードルーター（コントラクト実装） */
const os = implement(dashboardContract).$context<Context>().use(authMiddleware).use(loggingMiddleware);

const summary = os.summary.handler(({ input, context }) => {
  return handleDashboardSummary(input, context);
});

const byCategory = os.byCategory.handler(({ input, context }) => {
  return handleDashboardByCategory(input, context);
});

export const dashboardRouter = os.router({
  summary,
  byCategory,
});
