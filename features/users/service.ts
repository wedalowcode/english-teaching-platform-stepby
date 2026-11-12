import "server-only";

import { Prisma, UserStatus } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";

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