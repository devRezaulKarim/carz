"use client";

import { MultiStepFormComponentProps, MultiStepFormEnum } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/lib/utils";
import {
  SubmitDetailsSchema,
  SubmitDetailsType,
} from "@/schemas/customer.schema";
import { createCustomerAction } from "@/actions/customer";
import { toast } from "sonner";
import { routes } from "@/config/routes";

export const SubmitDetails = ({
  params,
  searchParams,
}: MultiStepFormComponentProps) => {
  const router = useRouter();
  const form = useForm<SubmitDetailsType>({
    resolver: zodResolver(SubmitDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      terms: "false",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
      router.push(url.toString());
    });
  };
  const onSubmitDetails: SubmitHandler<SubmitDetailsType> = (data) => {
    startTransition(async () => {
      const valid = form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));
      const handoverDate = decodeURIComponent(
        searchParams?.handoverDate as string,
      );
      const handoverTime = decodeURIComponent(
        searchParams?.handoverTime as string,
      );
      const date = formatDate(handoverDate, handoverTime);

      const { success, message } = await createCustomerAction({
        slug: params?.slug as string,
        date,
        ...data,
      });

      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 2500,
          position: "top-right",
          closeButton: true,
        });
        return;
      }

      toast.success("Success!", {
        description: message,
        duration: 1000,
        position: "top-right",
        closeButton: true,
      });

      setTimeout(() => {
        router.push(routes.success(params?.slug as string));
      }, 1000);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitDetails)}
        className="mx-auto flex min-h-96 flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg"
      >
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">First name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Your first name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastName">Last name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Your last name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Email"
                      type="email"
                      className="w-full bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mobile">Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Mobile"
                      type="tel"
                      className="w-full bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="terms"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      onCheckedChange={(e) => onChange(e ? "true" : "false")}
                      {...rest}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="!mt-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            variant="outline"
            className="flex w-full flex-1 gap-x-3 font-bold uppercase tracking-wider"
          >
            {isPrevPending ? (
              <Loader2 className="!h-4 !w-4 shrink-0 animate-spin" />
            ) : (
              <ArrowLeft className="!h-4 !w-4" />
            )}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase tracking-wider"
          >
            {isPending ? (
              <Loader2 className="!h-4 !w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Submit Details
          </Button>
        </div>
      </form>
    </Form>
  );
};
