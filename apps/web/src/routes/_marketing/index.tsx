import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, FolderOpen, PiggyBank, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_marketing/")({
  component: LandingPage,
});

const features = [
  {
    icon: <Receipt className="size-5 text-green-400" />,
    title: "取引管理",
    description: "収入・支出をかんたんに記録。日付やカテゴリで整理して一覧表示。",
  },
  {
    icon: <FolderOpen className="size-5 text-blue-400" />,
    title: "カテゴリ分類",
    description: "自分だけのカテゴリを作成。色分けで支出の傾向がひと目でわかる。",
  },
  {
    icon: <PiggyBank className="size-5 text-amber-400" />,
    title: "予算設定",
    description: "月ごとの予算を設定して使いすぎを防止。カテゴリ別に管理。",
  },
  {
    icon: <BarChart3 className="size-5 text-purple-400" />,
    title: "ダッシュボード",
    description: "収支サマリーやカテゴリ別内訳をリアルタイムで確認。",
  },
] as const;

function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-sm font-bold">家計簿アプリ</span>
        <Link to="/login">
          <Button variant="outline" size="sm">
            ログイン
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          シンプルな家計簿で
          <br />
          お金の流れを見える化
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          収入・支出の記録、カテゴリ分類、予算管理まで。
          <br />
          毎日の家計管理をシンプルに始めましょう。
        </p>
        <Link to="/login">
          <Button size="lg">
            無料で始める
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="border-t px-6 py-16">
        <h2 className="mb-8 text-center text-lg font-bold">主な機能</h2>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
        Built with Better-T-Stack
      </footer>
    </div>
  );
}
