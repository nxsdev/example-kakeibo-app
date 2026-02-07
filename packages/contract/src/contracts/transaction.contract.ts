import { oc } from "@orpc/contract";
import {
  transactionSchema,
  transactionListInputSchema,
  transactionListOutputSchema,
  transactionGetInputSchema,
  transactionCreateInputSchema,
  transactionUpdateInputSchema,
  transactionDeleteInputSchema,
} from "../schemas/transaction.schema";
import { z } from "zod/v4-mini";

/** 取引 API コントラクト */
export const transactionContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/transactions", tags: ["Transaction"] })
    .input(transactionListInputSchema)
    .output(transactionListOutputSchema),

  get: oc
    .route({ method: "GET", path: "/transactions/{id}", tags: ["Transaction"] })
    .input(transactionGetInputSchema)
    .output(transactionSchema),

  create: oc
    .route({ method: "POST", path: "/transactions/create", tags: ["Transaction"] })
    .input(transactionCreateInputSchema)
    .output(transactionSchema),

  update: oc
    .route({ method: "POST", path: "/transactions/update", tags: ["Transaction"] })
    .input(transactionUpdateInputSchema)
    .output(transactionSchema),

  delete: oc
    .route({ method: "POST", path: "/transactions/delete", tags: ["Transaction"] })
    .input(transactionDeleteInputSchema)
    .output(z.object({ success: z.boolean() })),
});
