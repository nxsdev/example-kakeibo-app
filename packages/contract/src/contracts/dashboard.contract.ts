import { oc } from "@orpc/contract";
import {
  dashboardSummaryInputSchema,
  dashboardSummaryOutputSchema,
  dashboardByCategoryInputSchema,
  dashboardByCategoryOutputSchema,
} from "../schemas/dashboard.schema";

/** ダッシュボード API コントラクト */
export const dashboardContract = oc.router({
  summary: oc
    .route({ method: "GET", path: "/dashboard/summary", tags: ["Dashboard"] })
    .input(dashboardSummaryInputSchema)
    .output(dashboardSummaryOutputSchema),

  byCategory: oc
    .route({ method: "GET", path: "/dashboard/by-category", tags: ["Dashboard"] })
    .input(dashboardByCategoryInputSchema)
    .output(dashboardByCategoryOutputSchema),
});
