"use client";

import { OTPSchema, OTPSchemaType } from "@/schemas/otp-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { OTPInput } from "./otp-input";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import {
  completeChallengeAction,
  resendChallengeAction,
} from "@/actions/challenge";
import { toast } from "sonner";
import { routes } from "@/config/routes";

export const OTPForm = () => {
  const [isCodePending, startCodeTransition] = useTransition();
  const [isSubmitPending, startSubmitTransition] = useTransition();
  const [sendButtonText, setSendButtonText] = useState<string>("Send code");

  const router = useRouter();
  const form = useForm<OTPSchemaType>({
    resolver: zodResolver(OTPSchema),
  });
  const onSubmit: SubmitHandler<OTPSchemaType> = (data) => {
    startSubmitTransition(async () => {
      const { success, message } = await completeChallengeAction(data.code);
      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 3000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        // router.push(routes.admin.dashboard);
        redirect(routes.admin.dashboard);
      }
    });
  };

  const sendCode = () => {
    startCodeTransition(async () => {
      const { success, message } = await resendChallengeAction();
      setSendButtonText("Resend code");

      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 3000,
          position: "top-right",
          closeButton: true,
        });
        return;
      }

      toast.success("Success!", {
        description: message,
        duration: 3000,
        position: "top-right",
        closeButton: true,
      });
    });
  };

  useEffect(() => {
    if (isCodePending) setSendButtonText("Sending...");
  }, [isCodePending]);
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-1 justify-center px-6 pt-10 lg:items-center lg:pt-0">
      <div className="flex w-full max-w-lg flex-col">
        <h3 className="mb-4 text-center text-4xl capitalize lg:text-5xl">
          One time password
        </h3>
        <p className="mb-12 text-center text-slate-500">
          Enter the six digit code sent to your email.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput type="number" setValue={onChange} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8 flex w-full items-center justify-center">
              <button
                type="button"
                className="items-centewr group flex cursor-pointer gap-2.5 text-base font-medium text-slate-600 transition-colors duration-200 hover:text-primary"
                onClick={sendCode}
                disabled={isCodePending}
              >
                {isCodePending ? (
                  <Loader2 className="!h-6 !w-6 animate-spin text-gray-500 transition-colors duration-200 group-hover:text-primary" />
                ) : (
                  <RotateCw className="!h-6 !w-6 text-gray-500 transition-colors duration-200 group-hover:text-primary" />
                )}
                {sendButtonText}
              </button>
            </div>
            <div className="mt-6 flex w-full flex-col gap-4 md:mt-16">
              <Button
                type="submit"
                className="flex w-full gap-x-2"
                disabled={isSubmitPending}
              >
                <span className="text-sm uppercase tracking-wider text-inherit">
                  {isSubmitPending ? "Verifying..." : "Verify"}
                </span>
                {isSubmitPending ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : null}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
