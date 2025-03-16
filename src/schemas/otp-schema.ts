import { z } from "zod";

export const OTPSchema = z.object({
  code: z
    .string()
    .min(6, { message: "OTP must be 6 characters long!" })
    .regex(/^\d+$/, { message: "OTP must contains only number!" }),
});

export type OTPSchemaType = z.infer<typeof OTPSchema>;
