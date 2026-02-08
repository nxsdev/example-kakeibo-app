import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = Route.useRouteContext();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">設定</h2>

      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-medium">プロフィール</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">名前</span>
            <span>{session.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">メールアドレス</span>
            <span>{session.user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
