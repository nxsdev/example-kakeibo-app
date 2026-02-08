import { oc } from "@orpc/contract";
import {
  categorySchema,
  categoryListInputSchema,
  categoryListOutputSchema,
  categoryCreateInputSchema,
  categoryUpdateInputSchema,
  categoryDeleteInputSchema,
} from "../schemas/category.schema";
import { deleteOutputSchema, authErrors, notFoundErrors } from "../schemas/common.schema";

/** カテゴリ API コントラクト */
export const categoryContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/categories", tags: ["Category"] })
    .input(categoryListInputSchema)
    .output(categoryListOutputSchema)
    .errors({ ...authErrors }),

  create: oc
    .route({ method: "POST", path: "/categories", tags: ["Category"] })
    .input(categoryCreateInputSchema)
    .output(categorySchema)
    .errors({ ...authErrors }),

  update: oc
    .route({ method: "PATCH", path: "/categories/{id}", tags: ["Category"] })
    .input(categoryUpdateInputSchema)
    .output(categorySchema)
    .errors({ ...authErrors, ...notFoundErrors }),

  delete: oc
    .route({ method: "DELETE", path: "/categories/{id}", tags: ["Category"] })
    .input(categoryDeleteInputSchema)
    .output(deleteOutputSchema)
    .errors({ ...authErrors, ...notFoundErrors }),
});
