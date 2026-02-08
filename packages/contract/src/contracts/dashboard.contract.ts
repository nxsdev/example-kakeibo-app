import { oc } from "@orpc/contract";
import {
  dashboardSummaryInputSchema,
  dashboardSummaryOutputSchema,
  dashboardByCategoryInputSchema,
  dashboardByCategoryOutputSchema,
} from "../schemas/dashboard.schema";
import { authErrors } from "../schemas/common.schema";

/** ダッシュボード API コントラクト */
export const dashboardContract = oc.router({
  summary: oc
    .route({ method: "GET", path: "/dashboard/summary", tags: ["Dashboard"] })
    .input(dashboardSummaryInputSchema)
    .output(dashboardSummaryOutputSchema)
    .errors({ ...authErrors }),

  byCategory: oc
    .route({ method: "GET", path: "/dashboard/categories", tags: ["Dashboard"] })
    .input(dashboardByCategoryInputSchema)
    .output(dashboardByCategoryOutputSchema)
    .errors({ ...authErrors }),
});
