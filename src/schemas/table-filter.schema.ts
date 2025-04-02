import { ClassifiedStatus, CustomerStatus } from "@prisma/client";
import { z } from "zod";

export const AdminClassifiedsFilterSchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(["ALL", ...Object.values(ClassifiedStatus)])
    .optional()
    .default("ALL"),
});
export const AdminCustomersFilterSchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(["ALL", ...Object.values(CustomerStatus)])
    .optional()
    .default("ALL"),
});
