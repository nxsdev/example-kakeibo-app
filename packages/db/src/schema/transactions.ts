import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { categories } from "./categories";

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    amount: integer("amount").notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    date: text("date").notNull(),
    note: text("note"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_date_idx").on(table.date),
    index("transactions_category_id_idx").on(table.categoryId),
  ],
);

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(user, {
    fields: [transactions.userId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
