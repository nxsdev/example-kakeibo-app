import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "@formkit/tempo";
import { TrendingUp, TrendingDown, Wallet, ArrowLeftRight } from "lucide-react";

import { orpc } from "@/utils/orpc";
import { SummaryCard } from "./-components/summary-card";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const currentMonth = format(new Date(), "YYYY-MM");

  const summary = useQuery(
    orpc.dashboard.summary.queryOptions({ input: { month: currentMonth } }),
  );

  const byCategory = useQuery(
    orpc.dashboard.byCategory.queryOptions({ input: { month: currentMonth, type: "expense" } }),
  );

  const recentTransactions = useQuery(
    orpc.transactions.list.queryOptions({ input: { page: 1, per_page: 5 } }),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold">ダッシュボード</h2>
      <p className="text-muted-foreground">{format(new Date(), "YYYY年MM月")}</p>

      {/* サマリーカード */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="収入"
          value={summary.data?.total_income ?? 0}
          icon={<TrendingUp className="size-4 text-green-500" />}
        />
        <SummaryCard
          title="支出"
          value={summary.data?.total_expense ?? 0}
          icon={<TrendingDown className="size-4 text-red-500" />}
        />
        <SummaryCard
          title="残高"
          value={summary.data?.balance ?? 0}
          icon={<Wallet className="size-4 text-blue-500" />}
        />
        <SummaryCard
          title="取引件数"
          value={summary.data?.transaction_count ?? 0}
          icon={<ArrowLeftRight className="size-4 text-muted-foreground" />}
          isCurrency={false}
        />
      </div>

      {/* カテゴリ別内訳 */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium">カテゴリ別支出</h3>
        {byCategory.data?.items.length === 0 && (
          <p className="text-sm text-muted-foreground">今月の支出データがありません</p>
        )}
        <div className="space-y-3">
          {byCategory.data?.items.map((item) => (
            <div key={item.category_id} className="flex items-center gap-3">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: item.category_color ?? "#888" }}
              />
              <span className="flex-1 text-sm">{item.category_name}</span>
              <span className="text-sm font-medium">
                {item.total.toLocaleString()}円
              </span>
              <span className="w-12 text-right text-xs text-muted-foreground">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 直近の取引 */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium">直近の取引</h3>
        {recentTransactions.data?.items.length === 0 && (
          <p className="text-sm text-muted-foreground">取引データがありません</p>
        )}
        <div className="space-y-2">
          {recentTransactions.data?.items.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={tx.type === "income" ? "text-green-500" : "text-red-500"}
                >
                  {tx.type === "income" ? "+" : "-"}
                </span>
                <span>{tx.category?.name ?? "不明"}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">{tx.date}</span>
                <span className="font-medium">
                  {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}円
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
