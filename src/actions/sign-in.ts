"use server";

import { signIn } from "@/auth";
import { routes } from "@/config/routes";
import { PrevState } from "@/config/types";
import { genericRateLimit } from "@/lib/rate-limiter";
import { SignInSchema } from "@/schemas/sign-in-schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signInAction = async (_: PrevState, formData: FormData) => {
  const limiterError = await genericRateLimit("login");
  if (limiterError) return limiterError;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { data, success } = SignInSchema.safeParse({
    email,
    password,
  });

  if (!success) return { success: false, message: "Invalid credentials!" };

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      redirectTo: routes.challenge,
    });

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "Invalid credentials!" };
  }
};
