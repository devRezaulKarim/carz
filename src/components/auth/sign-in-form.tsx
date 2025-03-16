"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormStatus } from "react-dom";
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { signInAction } from "@/actions/sign-in";

export const SignInForm = () => {
  const [state, formAction] = useActionState(signInAction, {
    success: false,
    message: "",
  });
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (state.success && formRef.current) {
      router.refresh();
      // router.push(routes.challenge);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md pb-60">
        <form
          action={formAction}
          ref={formRef}
          className="rounded-md border border-muted bg-white p-10 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold uppercase">Admin Sign In</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="placeholder:text-gray-500"
                placeholder="Enter your administrator email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="password"
                className="placeholder:text-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="my-6">
              <div className="mb-2 text-center text-sm text-gray-600">
                <b>This is for admin only.</b>
              </div>
            </div>
            <div className="space-y-4">
              <SubmitBtn />
              {state?.success && (
                <div className="flex items-center gap-2 rounded-md bg-green-500 p-3 text-white">
                  <CircleCheckIcon className="!h-5 !w-5" />
                  <span>Success! {state?.message}</span>
                </div>
              )}
              {!state?.success && state?.message && (
                <div className="flex items-center gap-2 rounded-md bg-red-500 p-3 text-white">
                  <CircleX className="!h-5 !w-5" />
                  <span>Error! {state?.message}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full font-bold uppercase tracking-widest"
      disabled={pending}
    >
      {pending && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      )}
      Sign In
    </Button>
  );
};
