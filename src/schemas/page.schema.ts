import { z } from "zod";

export const PageSchema = z
  .string()
  .transform((value) => Math.max(1, Number(value)))
  .optional();
