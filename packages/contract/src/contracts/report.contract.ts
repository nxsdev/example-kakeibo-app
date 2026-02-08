import { oc } from "@orpc/contract";
import {
  reportComparisonInputSchema,
  reportComparisonOutputSchema,
  reportCategoryTrendInputSchema,
  reportCategoryTrendOutputSchema,
  reportMonthlyTotalsInputSchema,
  reportMonthlyTotalsOutputSchema,
} from "../schemas/report.schema";
import { authErrors } from "../schemas/common.schema";

/** レポート API コントラクト */
export const reportContract = oc.router({
  comparison: oc
    .route({ method: "GET", path: "/reports/comparison", tags: ["Report"] })
    .input(reportComparisonInputSchema)
    .output(reportComparisonOutputSchema)
    .errors({ ...authErrors }),

  categoryTrend: oc
    .route({ method: "GET", path: "/reports/category-trends", tags: ["Report"] })
    .input(reportCategoryTrendInputSchema)
    .output(reportCategoryTrendOutputSchema)
    .errors({ ...authErrors }),

  monthlyTotals: oc
    .route({ method: "GET", path: "/reports/monthly-totals", tags: ["Report"] })
    .input(reportMonthlyTotalsInputSchema)
    .output(reportMonthlyTotalsOutputSchema)
    .errors({ ...authErrors }),
});
