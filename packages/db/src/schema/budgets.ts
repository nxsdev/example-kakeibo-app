import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { categories } from "./categories";

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    amount: integer("amount").notNull(),
    alertThreshold: integer("alert_threshold").notNull().default(80),
    month: text("month").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [index("budgets_user_id_month_idx").on(table.userId, table.month)],
);

export const budgetRelations = relations(budgets, ({ one }) => ({
  user: one(user, {
    fields: [budgets.userId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));
