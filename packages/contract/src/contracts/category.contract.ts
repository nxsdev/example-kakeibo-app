import { oc } from "@orpc/contract";
import {
  categorySchema,
  categoryListInputSchema,
  categoryCreateInputSchema,
  categoryUpdateInputSchema,
  categoryDeleteInputSchema,
} from "../schemas/category.schema";
import { z } from "zod/v4-mini";

/** カテゴリ API コントラクト */
export const categoryContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/categories", tags: ["Category"] })
    .input(categoryListInputSchema)
    .output(z.array(categorySchema)),

  create: oc
    .route({ method: "POST", path: "/categories/create", tags: ["Category"] })
    .input(categoryCreateInputSchema)
    .output(categorySchema),

  update: oc
    .route({ method: "POST", path: "/categories/update", tags: ["Category"] })
    .input(categoryUpdateInputSchema)
    .output(categorySchema),

  delete: oc
    .route({ method: "POST", path: "/categories/delete", tags: ["Category"] })
    .input(categoryDeleteInputSchema)
    .output(z.object({ success: z.boolean() })),
});
