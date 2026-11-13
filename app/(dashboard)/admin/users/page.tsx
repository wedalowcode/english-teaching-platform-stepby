import { Suspense } from "react";

import {
  UserList,
} from "@/features/users/components/user-list";

export const instant = false;

type Props = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default function UsersPage({
  searchParams,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          用户管理
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          管理平台用户，包括用户资料、账号状态和角色信息。提交
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg border bg-card p-6">
            正在加载用户列表...
          </div>
        }
      >
        <UserList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}