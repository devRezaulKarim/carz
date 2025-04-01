import { ClassifiedStatus } from "@prisma/client";
import { z } from "zod";

export const AdminClassifiedsFilterSchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(["ALL", ...Object.values(ClassifiedStatus)])
    .optional()
    .default("ALL"),
});
