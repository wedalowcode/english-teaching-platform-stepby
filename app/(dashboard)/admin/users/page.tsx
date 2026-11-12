export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          用户管理
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          管理平台用户，包括用户资料、账号状态和角色信息。
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          用户列表将在这里展示。
        </p>
      </div>
    </div>
  );
}