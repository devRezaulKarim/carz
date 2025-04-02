import { CustomerStatus } from "@prisma/client";
import { z } from "zod";

export const SubmitDetailsSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Enter a valid email!" }),
  mobile: z.string().min(1, { message: "Mobile is required!" }),
  terms: z.enum(["true", "false"], {
    message: "You must agree to the terms and conditions!",
  }),
});

export type SubmitDetailsType = z.infer<typeof SubmitDetailsSchema>;

export const CreateCustomerSchema = SubmitDetailsSchema.extend({
  date: z.date(),
  slug: z.string(),
});

export type CreateCustomerType = z.infer<typeof CreateCustomerSchema>;

export const EditCustomerSchema = z.object({
  status: z.nativeEnum(CustomerStatus),
});
export type EditCustomerType = z.infer<typeof EditCustomerSchema>;

export const UpdateCustomerSchema = EditCustomerSchema.extend({
  id: z.number(),
});
