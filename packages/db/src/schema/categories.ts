import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { transactions } from "./transactions";
import { budgets } from "./budgets";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"),
  color: text("color"),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(user, {
    fields: [categories.user_id],
    references: [user.id],
  }),
  transactions: many(transactions),
  budgets: many(budgets),
}));
