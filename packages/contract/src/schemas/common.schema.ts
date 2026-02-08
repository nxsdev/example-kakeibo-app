import { z } from "zod/v4-mini";

/** ページネーション入力 */
export const paginationInputSchema = z.object({
  page: z.optional(z.number().check(z.minimum(1))),
  perPage: z.optional(z.number().check(z.minimum(1), z.maximum(100))),
});

/** ページネーション出力メタ */
export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
});

/** 取引タイプ */
export const transactionTypeSchema = z.enum(["income", "expense"]);

export type TransactionType = z.infer<typeof transactionTypeSchema>;

/** 共通削除出力 */
export const deleteOutputSchema = z.object({ id: z.string() });

/** 共通エラーマップ */
export const authErrors = {
  UNAUTHORIZED: { message: "認証が必要です" },
} as const;

export const notFoundErrors = {
  NOT_FOUND: { message: "リソースが見つかりません" },
} as const;

export const importValidationErrors = {
  UNPROCESSABLE_CONTENT: {
    message: "インポートデータにエラーがあります",
    data: z.object({
      errors: z.array(
        z.object({
          row: z.number(),
          field: z.string(),
          message: z.string(),
        }),
      ),
    }),
  },
} as const;
