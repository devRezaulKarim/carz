import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is required!" })
    .email({ message: "Please enter a valid email!" }),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, { message: "Password must be minimum 6 characters long!" })
    .max(32, { message: "Password cant be more than 32 characters long!" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
          "Password must contain at least one uppercase, one lowercase, one number, and one special character!",
      },
    ),
});
