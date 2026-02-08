import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { TransactionImportInput } from "@example-kakeibo-app/contract";
import { parseCsv, CsvParseError } from "../../domain/transactions/parse-csv";
import { validateImportRows } from "../../domain/transactions/validate-import-rows";

/** CSVから取引を一括インポートする */
export async function handleImportTransactions(
  input: TransactionImportInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  // CSV解析
  let rows;
  try {
    rows = parseCsv(input.csv);
  } catch (e) {
    if (e instanceof CsvParseError) {
      throw new ORPCError("BAD_REQUEST", { message: e.message });
    }
    throw e;
  }

  if (rows.length === 0) {
    return { importedCount: 0 };
  }

  // ユーザーのカテゴリを取得して「名前:タイプ → ID」のマップを構築
  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, context.session.user.id));

  const categoryMap = new Map(userCategories.map((c) => [`${c.name}:${c.type}`, c.id]));

  // バリデーション
  const result = validateImportRows(rows, categoryMap);

  if ("errors" in result) {
    throw new ORPCError("UNPROCESSABLE_CONTENT", {
      message: "インポートデータにエラーがあります",
      data: { errors: result.errors },
    });
  }

  // 一括挿入
  await db.insert(transactions).values(
    result.valid.map((row) => ({
      ...row,
      userId: context.session.user.id,
    })),
  );

  return { importedCount: result.valid.length };
}
