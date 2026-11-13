import { z } from "zod";

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),

  pageSize: z.coerce
    .number()
    .int()
    .refine((value) => [10, 20, 50, 100].includes(value))
    .catch(10),

  keyword: z.string().trim().max(50).catch(""),

  status: z
    .enum(["ACTIVE", "DISABLED"])
    .optional()
    .catch(undefined),
});

// 姓名校验
const nameField = z
  .string()
  .trim()
  .min(1, "请输入姓名")
  .max(50, "姓名不能超过 50 位");

// 邮箱校验
const emailField = z
  .email("邮箱格式不正确")
  .max(100, "邮箱不能超过 100 位")
  .transform((value) => value.toLowerCase());

// 用户名校验
const usernameField = z
  .string()
  .trim()
  .min(3, "用户名至少 3 位")
  .max(30, "用户名不能超过 30 位")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "只能使用字母、数字和下划线"
  )
  .transform((value) => value.toLowerCase());

// 手机号校验
const phoneField = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .refine(
    (value) => value === null || /^1[3-9]\d{9}$/.test(value),
    "手机号格式不正确"
  );

// 用户新增数据校验
export const createUserSchema = z.object({
  name: nameField,
  email: emailField,
  username: usernameField,
  phone: phoneField,
  password: z
    .string()
    .min(8, "密码至少 8 位")
    .max(128, "密码不能超过 128 位"),
});

// 从 Schema 中推导 TypeScript 类型
export type CreateUserInput = z.infer<
  typeof createUserSchema
>;

// 表单提交状态
export type CreateUserState = {
  message?: string;

  fieldErrors?: Record<string, string[]>;

  values?: {
    name: string;
    email: string;
    username: string;
    phone: string;
  };
};

// 将 Zod 校验错误转换为字段错误
export function toFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  const flattened = z.flattenError(error).fieldErrors;

  const result: Record<string, string[]> = {};

  for (const [key, messages] of Object.entries(flattened)) {
    if (Array.isArray(messages) && messages.length > 0) {
      result[key] = messages;
    }
  }

  return result;
}