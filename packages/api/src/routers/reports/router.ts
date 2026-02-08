import { implement } from "@orpc/server";
import { reportContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { authMiddleware, loggingMiddleware } from "../../index";
import { handleComparison } from "./comparison.handler";
import { handleCategoryTrend } from "./category-trend.handler";
import { handleMonthlyTotals } from "./monthly-totals.handler";

/** レポートルーター（コントラクト実装） */
const os = implement(reportContract).$context<Context>().use(authMiddleware).use(loggingMiddleware);

const comparison = os.comparison.handler(({ input, context }) => {
  return handleComparison(input, context);
});

const categoryTrend = os.categoryTrend.handler(({ input, context }) => {
  return handleCategoryTrend(input, context);
});

const monthlyTotals = os.monthlyTotals.handler(({ input, context }) => {
  return handleMonthlyTotals(input, context);
});

export const reportRouter = os.router({
  comparison,
  categoryTrend,
  monthlyTotals,
});
