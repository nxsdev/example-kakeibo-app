import { z } from "zod/v4-mini";
import type { CsvRow } from "./parse-csv";

export type ImportRowError = {
  row: number;
  field: string;
  message: string;
};

export type ValidatedRow = {
  date: string;
  type: "income" | "expense";
  categoryId: string;
  amount: number;
  note: string | undefined;
};

const csvRowSchema = z.object({
  date: z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, "日付はYYYY-MM-DD形式で入力してください")),
  type: z.enum(["income", "expense"], {
    error: 'タイプは "income" または "expense" を指定してください',
  }),
  amount: z.coerce.number().check(z.positive("金額は0より大きい数値を入力してください")),
  note: z.string(),
});

/** CSVの各行をバリデーションし、カテゴリIDを解決する */
export function validateImportRows(
  rows: CsvRow[],
  categoryMap: Map<string, string>,
): { valid: ValidatedRow[] } | { errors: ImportRowError[] } {
  const errors: ImportRowError[] = [];
  const valid: ValidatedRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const rowNum = i + 2; // 1-indexed + header

    const result = csvRowSchema.safeParse(row);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          row: rowNum,
          field: String(issue.path?.[0] ?? "unknown"),
          message: issue.message,
        });
      }
    }

    // カテゴリ解決（外部データ依存のためZod外で処理）
    const categoryKey = `${row.category_name}:${row.category_type}`;
    const categoryId = categoryMap.get(categoryKey);
    if (!categoryId) {
      errors.push({
        row: rowNum,
        field: "category_name",
        message: `カテゴリ "${row.category_name}" (${row.category_type}) が見つかりません`,
      });
    }

    if (errors.length === 0 && result.success) {
      valid.push({
        date: result.data.date,
        type: result.data.type,
        categoryId: categoryId!,
        amount: result.data.amount,
        note: result.data.note || undefined,
      });
    }
  }

  if (errors.length > 0) return { errors };
  return { valid };
}
