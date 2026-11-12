import Form from "next/form";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { userListQuerySchema } from "@/features/users/schemas";
import { getUserList } from "@/features/users/service";

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export async function UserList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const query = userListQuerySchema.parse(params);

  const {
    items,
    total,
    page,
    pageSize,
    totalPages,
  } = await getUserList(query);

  function buildHref(targetPage: number) {
    const search = new URLSearchParams();

    if (query.keyword) {
      search.set("keyword", query.keyword);
    }

    if (query.status) {
      search.set("status", query.status);
    }

    if (targetPage > 1) {
      search.set("page", String(targetPage));
    }

    const queryString = search.toString();

    return queryString
      ? `/admin/users?${queryString}`
      : "/admin/users";
  }

  return (
    <div className="space-y-4">
      <Form
        action="/admin/users"
        className="flex flex-wrap items-center gap-2"
      >
        <Input
          name="keyword"
          defaultValue={query.keyword}
          placeholder="搜索姓名、用户名、邮箱或手机号"
          className="max-w-xs"
        />

        <select
          name="status"
          defaultValue={query.status ?? ""}
          aria-label="按状态筛选"
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">全部状态</option>
          <option value="ACTIVE">启用</option>
          <option value="DISABLED">停用</option>
        </select>

        <Button type="submit">
          搜索
        </Button>

        <Link
          href="/admin/users"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          重置
        </Link>
      </Form>

      <p className="text-sm text-muted-foreground">
        共 {total} 位用户
      </p>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.username ?? "-"}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.phone ?? "-"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      user.status === "ACTIVE"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.status === "ACTIVE"
                      ? "启用"
                      : "停用"}
                  </Badge>
                </TableCell>

                <TableCell>
                  {user.createdAt.toLocaleString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                  })}
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  暂无用户数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          第 {page} / {totalPages} 页，每页 {pageSize} 条
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={buildHref(page - 1)}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            上一页
          </Link>

          <Link
            href={buildHref(page + 1)}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            下一页
          </Link>
        </div>
      </div>
    </div>
  );
}