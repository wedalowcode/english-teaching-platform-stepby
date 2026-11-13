import "server-only";

import { hash } from "argon2";

import { Prisma, UserStatus } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";

import type { CreateUserInput } from "./schemas";

type UserListParams = {
  page: number;
  pageSize: number;
  keyword: string;
  status?: UserStatus;
};

export async function getUserList(params: UserListParams) {
  const { page, pageSize, keyword, status } = params;

  const where: Prisma.UserWhereInput = {};

  if (keyword) {
    where.OR = [
      {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        username: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: keyword,
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  const total = await db.user.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const currentPage = Math.min(
    Math.max(1, page),
    totalPages
  );

  const items = await db.user.findMany({
    where,

    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      status: true,
      createdAt: true,
    },

    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],

    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return {
    items,
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

// 获取 Prisma 错误编码
function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = (error as { code?: unknown }).code;

    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

// 获取数据库唯一约束对应的字段
function getUniqueTargetFields(error: unknown): string[] {
  if (
    typeof error !== "object" ||
    error === null ||
    !("meta" in error) ||
    !error.meta ||
    typeof error.meta !== "object" ||
    !("target" in error.meta)
  ) {
    return [];
  }

  const target = error.meta.target;

  if (Array.isArray(target)) {
    return target.map(String);
  }

  return typeof target === "string" ? [target] : [];
}

// 用户创建结果
export type CreateUserResult =
  | {
      success: true;
    }
  | {
      success: false;
      field: "username" | "email";
      message: string;
    };

// 创建用户
export async function createUser(
  input: CreateUserInput
): Promise<CreateUserResult> {
  // 生成用户 ID
  const userId = crypto.randomUUID();

  // 对明文密码进行 Argon2id 哈希处理
  const passwordHash = await hash(input.password);

  try {
    await db.user.create({
      data: {
        id: userId,
        name: input.name,
        email: input.email,
        username: input.username,
        phone: input.phone,

        // 同时创建 credential 登录账号
        accounts: {
          create: {
            id: crypto.randomUUID(),
            accountId: userId,
            providerId: "credential",
            password: passwordHash,
          },
        },
      },

      select: {
        id: true,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    // P2002 表示数据库唯一约束冲突
    if (getErrorCode(error) === "P2002") {
      const fields = getUniqueTargetFields(error);

      if (fields.includes("username")) {
        return {
          success: false,
          field: "username",
          message: "用户名已存在",
        };
      }

      if (fields.includes("email")) {
        return {
          success: false,
          field: "email",
          message: "邮箱已被使用",
        };
      }
    }

    throw error;
  }
}