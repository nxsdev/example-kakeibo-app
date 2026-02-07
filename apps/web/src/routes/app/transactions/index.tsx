import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod/v4-mini";
import { Plus } from "lucide-react";

import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";

/** 検索パラメータのスキーマ */
const searchParamsSchema = z.object({
  page: z.optional(z.coerce.number()),
  type: z.optional(z.enum(["income", "expense"])),
  category_id: z.optional(z.string()),
  date_from: z.optional(z.string()),
  date_to: z.optional(z.string()),
});

export const Route = createFileRoute("/app/transactions/")({
  component: TransactionsPage,
  validateSearch: searchParamsSchema,
});

function TransactionsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isLoading } = useQuery(
    orpc.transactions.list.queryOptions({
      input: {
        page: search.page ?? 1,
        per_page: 20,
        type: search.type,
        category_id: search.category_id,
        date_from: search.date_from,
        date_to: search.date_to,
      },
    }),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">取引一覧</h2>
        <Link to="/app/transactions/new">
          <Button>
            <Plus className="size-4" />
            新規登録
          </Button>
        </Link>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!search.type ? "default" : "outline"}
          size="sm"
          onClick={() => navigate({ search: { ...search, type: undefined, page: 1 } })}
        >
          すべて
        </Button>
        <Button
          variant={search.type === "income" ? "default" : "outline"}
          size="sm"
          onClick={() => navigate({ search: { ...search, type: "income", page: 1 } })}
        >
          収入
        </Button>
        <Button
          variant={search.type === "expense" ? "default" : "outline"}
          size="sm"
          onClick={() => navigate({ search: { ...search, type: "expense", page: 1 } })}
        >
          支出
        </Button>
      </div>

      {/* テーブル */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">日付</th>
              <th className="p-3 text-left font-medium">カテゴリ</th>
              <th className="p-3 text-left font-medium">メモ</th>
              <th className="p-3 text-right font-medium">金額</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  読み込み中...
                </td>
              </tr>
            )}
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  取引データがありません
                </td>
              </tr>
            )}
            {data?.items.map((tx) => (
              <tr key={tx.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="p-3">{tx.date}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: tx.category?.color ?? "#888" }}
                    />
                    {tx.category?.name ?? "不明"}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{tx.note ?? "-"}</td>
                <td className={`p-3 text-right font-medium ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
                  {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}円
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {data?.meta && data.meta.total_pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.meta.page <= 1}
            onClick={() => navigate({ search: { ...search, page: data.meta.page - 1 } })}
          >
            前へ
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {data.meta.page} / {data.meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.meta.page >= data.meta.total_pages}
            onClick={() => navigate({ search: { ...search, page: data.meta.page + 1 } })}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
