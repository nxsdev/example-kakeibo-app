import { oc } from "@orpc/contract";
import {
  budgetListInputSchema,
  budgetListOutputSchema,
  budgetCreateInputSchema,
  budgetUpdateInputSchema,
  budgetSchema,
} from "../schemas/budget.schema";
import { authErrors, notFoundErrors } from "../schemas/common.schema";

/** 予算 API コントラクト */
export const budgetContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/budgets", tags: ["Budget"] })
    .input(budgetListInputSchema)
    .output(budgetListOutputSchema)
    .errors({ ...authErrors }),

  create: oc
    .route({ method: "POST", path: "/budgets", tags: ["Budget"] })
    .input(budgetCreateInputSchema)
    .output(budgetSchema)
    .errors({ ...authErrors }),

  update: oc
    .route({ method: "PATCH", path: "/budgets/{id}", tags: ["Budget"] })
    .input(budgetUpdateInputSchema)
    .output(budgetSchema)
    .errors({ ...authErrors, ...notFoundErrors }),
});
