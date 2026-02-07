import { oc } from "@orpc/contract";
import {
  budgetListInputSchema,
  budgetListOutputSchema,
  budgetCreateInputSchema,
  budgetUpdateInputSchema,
  budgetSchema,
} from "../schemas/budget.schema";

/** 予算 API コントラクト */
export const budgetContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/budgets", tags: ["Budget"] })
    .input(budgetListInputSchema)
    .output(budgetListOutputSchema),

  create: oc
    .route({ method: "POST", path: "/budgets/create", tags: ["Budget"] })
    .input(budgetCreateInputSchema)
    .output(budgetSchema),

  update: oc
    .route({ method: "POST", path: "/budgets/update", tags: ["Budget"] })
    .input(budgetUpdateInputSchema)
    .output(budgetSchema),
});
