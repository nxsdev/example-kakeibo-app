import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { categories } from "./categories";

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    amount: integer("amount").notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    category_id: text("category_id")
      .notNull()
      .references(() => categories.id),
    date: text("date").notNull(),
    note: text("note"),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    created_at: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updated_at: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.user_id),
    index("transactions_date_idx").on(table.date),
    index("transactions_category_id_idx").on(table.category_id),
  ],
);

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(user, {
    fields: [transactions.user_id],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [transactions.category_id],
    references: [categories.id],
  }),
}));
