import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, Tag, Wallet, Settings, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/app/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { to: "/app/transactions", label: "取引一覧", icon: ArrowLeftRight },
  { to: "/app/categories", label: "カテゴリ", icon: Tag },
  { to: "/app/budgets", label: "予算", icon: Wallet },
  { to: "/app/settings", label: "設定", icon: Settings },
] as const;

export default function Sidebar({ userName }: { userName: string }) {
  const router = useRouter();

  return (
    <aside className="flex flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-border p-4">
        <h1 className="text-lg font-bold">家計簿</h1>
        <p className="text-xs text-muted-foreground">{userName}</p>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.navigate({ to: "/login" });
                },
              },
            });
          }}
        >
          <LogOut className="size-4" />
          ログアウト
        </Button>
      </div>
    </aside>
  );
}
