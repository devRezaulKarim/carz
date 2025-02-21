import { z } from "zod";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required!").email("Invalid email!"),
  password: z.string().min(8, "Password should be minimum 8 character!"),
});

export default signinSchema;
