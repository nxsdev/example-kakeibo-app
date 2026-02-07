import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import Sidebar from "@/components/layout/sidebar";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: AppLayout,
});

/** 認証済みユーザー用レイアウト（サイドバー + メインコンテンツ） */
function AppLayout() {
  const { session } = Route.useRouteContext();

  return (
    <div className="grid h-svh grid-cols-[240px_1fr]">
      <Sidebar userName={session.user.name} />
      <main className="overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
