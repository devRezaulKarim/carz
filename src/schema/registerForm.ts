import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().min(1, "Email is required!").email("Invalid email!"),
    password: z.string().min(8, "Password should be minimum 8 character!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });
export default registerSchema;
