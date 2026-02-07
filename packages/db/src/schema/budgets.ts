import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { categories } from "./categories";

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    category_id: text("category_id")
      .notNull()
      .references(() => categories.id),
    amount: integer("amount").notNull(),
    month: text("month").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    created_at: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("budgets_user_id_month_idx").on(table.user_id, table.month),
  ],
);

export const budgetRelations = relations(budgets, ({ one }) => ({
  user: one(user, {
    fields: [budgets.user_id],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [budgets.category_id],
    references: [categories.id],
  }),
}));
