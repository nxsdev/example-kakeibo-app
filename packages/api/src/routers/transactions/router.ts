import { implement } from "@orpc/server";
import { transactionContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { authMiddleware, loggingMiddleware } from "../../index";
import { handleListTransactions } from "./list.handler";
import { handleGetTransaction } from "./get.handler";
import { handleCreateTransaction } from "./create.handler";
import { handleUpdateTransaction } from "./update.handler";
import { handleDeleteTransaction } from "./delete.handler";
import { handleExportTransactions } from "./export.handler";
import { handleImportTransactions } from "./import.handler";

/** 取引ルーター（コントラクト実装） */
const os = implement(transactionContract).$context<Context>().use(authMiddleware).use(loggingMiddleware);

const list = os.list.handler(({ input, context }) => {
  return handleListTransactions(input, context);
});

const get = os.get.handler(({ input, context }) => {
  return handleGetTransaction(input, context);
});

const create = os.create.handler(({ input, context }) => {
  return handleCreateTransaction(input, context);
});

const update = os.update.handler(({ input, context }) => {
  return handleUpdateTransaction(input, context);
});

const del = os.delete.handler(({ input, context }) => {
  return handleDeleteTransaction(input, context);
});

const exp = os.export.handler(({ input, context }) => {
  return handleExportTransactions(input, context);
});

const imp = os.import.handler(({ input, context }) => {
  return handleImportTransactions(input, context);
});

export const transactionRouter = os.router({
  list,
  get,
  create,
  update,
  delete: del,
  export: exp,
  import: imp,
});
