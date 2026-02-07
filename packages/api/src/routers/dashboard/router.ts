import { implement } from "@orpc/server";
import { dashboardContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { assertAuth } from "../../context";
import { handleDashboardSummary } from "./summary.handler";
import { handleDashboardByCategory } from "./by-category.handler";

/** ダッシュボードルーター（コントラクト実装） */
const os = implement(dashboardContract).$context<Context>();

const summary = os.summary.handler(({ input, context }) => {
  assertAuth(context);
  return handleDashboardSummary(input, context);
});

const byCategory = os.byCategory.handler(({ input, context }) => {
  assertAuth(context);
  return handleDashboardByCategory(input, context);
});

export const dashboardRouter = os.router({
  summary,
  byCategory,
});
