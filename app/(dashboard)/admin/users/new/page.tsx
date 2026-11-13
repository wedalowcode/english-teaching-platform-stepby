import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { UserCreateForm } from "@/features/users/components/user-create-form";

export const instant = false;

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            新增用户
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            创建新的系统用户账号并设置初始密码。
          </p>
        </div>

        <Link
          href="/admin/users"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          返回用户列表
        </Link>
      </div>

      <div className="max-w-xl rounded-lg border bg-card p-6">
        <UserCreateForm />
      </div>
    </div>
  );
}