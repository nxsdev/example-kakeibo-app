import { oc } from "@orpc/contract";
import {
  transactionSchema,
  transactionListInputSchema,
  transactionListOutputSchema,
  transactionGetInputSchema,
  transactionCreateInputSchema,
  transactionUpdateInputSchema,
  transactionDeleteInputSchema,
  transactionExportInputSchema,
  transactionExportOutputSchema,
  transactionImportInputSchema,
  transactionImportOutputSchema,
} from "../schemas/transaction.schema";
import {
  deleteOutputSchema,
  authErrors,
  notFoundErrors,
  importValidationErrors,
} from "../schemas/common.schema";

/** 取引 API コントラクト */
export const transactionContract = oc.router({
  list: oc
    .route({ method: "GET", path: "/transactions", tags: ["Transaction"] })
    .input(transactionListInputSchema)
    .output(transactionListOutputSchema)
    .errors({ ...authErrors }),

  get: oc
    .route({ method: "GET", path: "/transactions/{id}", tags: ["Transaction"] })
    .input(transactionGetInputSchema)
    .output(transactionSchema)
    .errors({ ...authErrors, ...notFoundErrors }),

  create: oc
    .route({ method: "POST", path: "/transactions", tags: ["Transaction"] })
    .input(transactionCreateInputSchema)
    .output(transactionSchema)
    .errors({ ...authErrors }),

  update: oc
    .route({ method: "PATCH", path: "/transactions/{id}", tags: ["Transaction"] })
    .input(transactionUpdateInputSchema)
    .output(transactionSchema)
    .errors({ ...authErrors, ...notFoundErrors }),

  delete: oc
    .route({ method: "DELETE", path: "/transactions/{id}", tags: ["Transaction"] })
    .input(transactionDeleteInputSchema)
    .output(deleteOutputSchema)
    .errors({ ...authErrors, ...notFoundErrors }),

  export: oc
    .route({ method: "GET", path: "/transactions/export", tags: ["Transaction"] })
    .input(transactionExportInputSchema)
    .output(transactionExportOutputSchema)
    .errors({ ...authErrors }),

  import: oc
    .route({ method: "POST", path: "/transactions/import", tags: ["Transaction"] })
    .input(transactionImportInputSchema)
    .output(transactionImportOutputSchema)
    .errors({
      ...authErrors,
      BAD_REQUEST: { message: "CSVの形式が不正です" },
      ...importValidationErrors,
    }),
});
