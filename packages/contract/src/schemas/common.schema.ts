import { z } from "zod/v4-mini";

/** ページネーション入力 */
export const paginationInputSchema = z.object({
  page: z.optional(z.number().check(z.minimum(1))),
  per_page: z.optional(z.number().check(z.minimum(1), z.maximum(100))),
});

/** ページネーション出力メタ */
export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
});

/** 取引タイプ */
export const transactionTypeSchema = z.enum(["income", "expense"]);

export type TransactionType = z.infer<typeof transactionTypeSchema>;
