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