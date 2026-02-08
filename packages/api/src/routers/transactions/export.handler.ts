import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { TransactionExportInput } from "@example-kakeibo-app/contract";

/** 取引をCSV形式でエクスポートする */
export async function handleExportTransactions(
  input: TransactionExportInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  const conditions = [eq(transactions.userId, context.session.user.id)];

  if (input.dateFrom) {
    conditions.push(gte(transactions.date, input.dateFrom));
  }
  if (input.dateTo) {
    conditions.push(lte(transactions.date, input.dateTo));
  }

  const rows = await db
    .select({
      date: transactions.date,
      type: transactions.type,
      categoryName: categories.name,
      categoryType: categories.type,
      amount: transactions.amount,
      note: transactions.note,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(asc(transactions.date));

  const header = "date,type,category_name,category_type,amount,note";
  const lines = rows.map(
    (r) =>
      `${r.date},${r.type},${r.categoryName ?? ""},${r.categoryType ?? ""},${r.amount},${r.note ?? ""}`,
  );

  return {
    csv: [header, ...lines].join("\n"),
    count: rows.length,
  };
}
