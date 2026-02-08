import { implement } from "@orpc/server";
import { budgetContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { authMiddleware, loggingMiddleware } from "../../index";
import { handleListBudgets } from "./list.handler";
import { handleCreateBudget } from "./create.handler";
import { handleUpdateBudget } from "./update.handler";

/** 予算ルーター（コントラクト実装） */
const os = implement(budgetContract).$context<Context>().use(authMiddleware).use(loggingMiddleware);

const list = os.list.handler(({ input, context }) => {
  return handleListBudgets(input, context);
});

const create = os.create.handler(({ input, context }) => {
  return handleCreateBudget(input, context);
});

const update = os.update.handler(({ input, context }) => {
  return handleUpdateBudget(input, context);
});

export const budgetRouter = os.router({
  list,
  create,
  update,
});
