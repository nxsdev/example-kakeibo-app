import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { categoryRouter } from "./categories/router";
import { transactionRouter } from "./transactions/router";
import { budgetRouter } from "./budgets/router";
import { dashboardRouter } from "./dashboard/router";
import { reportRouter } from "./reports/router";

export const appRouter = {
  /** ヘルスチェック */
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),

  /** カテゴリ管理 */
  categories: categoryRouter,

  /** 取引管理 */
  transactions: transactionRouter,

  /** 予算管理 */
  budgets: budgetRouter,

  /** ダッシュボード */
  dashboard: dashboardRouter,

  /** レポート */
  reports: reportRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
