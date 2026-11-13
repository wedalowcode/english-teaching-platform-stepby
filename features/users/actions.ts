"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createUser } from "./service";

import {
  createUserSchema,
  toFieldErrors,
  type CreateUserState,
} from "./schemas";

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  // 读取表单数据
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    username: String(formData.get("username") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  };

  // 使用 Zod 校验表单数据
  const parsed = createUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // 校验失败
  if (!parsed.success) {
    return {
      message: "请检查表单内容",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  // 调用 Service 创建用户
  const result = await createUser(parsed.data);

  // 处理用户名或邮箱重复
  if (!result.success) {
    return {
      message: result.message,
      fieldErrors: {
        [result.field]: [result.message],
      },
      values,
    };
  }

  // 刷新用户列表缓存
  revalidatePath("/admin/users");

  // 创建成功后返回用户列表
  redirect("/admin/users?created=1");
}