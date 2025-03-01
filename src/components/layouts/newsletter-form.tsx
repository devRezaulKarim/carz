"use client";

import { subscribeAction } from "@/actions/subscribe";
import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeSchema } from "@/schemas/subscriber.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export const NewsletterForm = () => {
  const [state, formAction] = useActionState(subscribeAction, undefined);

  const form = useForm({
    resolver: zodResolver(subscribeSchema),
  });

  const handleFormAction = async (formData: FormData) => {
    const valid = await form.trigger();
    if (!valid) return;
    formAction(formData);
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) formRef.current.reset();
  }, [state?.success]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-primary lg:text-lg xl:text-xl">
        Subscribe to our inventory update
      </h3>
      <p className="text-sm text-gray-700 xl:text-base">
        {" "}
        Enter your details to receive new stock updates.
      </p>
      <Form {...form}>
        <form
          action={handleFormAction}
          ref={formRef}
          onSubmit={() => null}
          className="space-y-2"
        >
          <div className="grid grid-cols-2 space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First name"
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
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="w-full bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubscribeNowBtn />
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
        </form>
      </Form>
    </div>
  );
};

const SubscribeNowBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full font-bold uppercase"
      disabled={pending}
    >
      {pending && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      )}
      Subscribe
    </Button>
  );
};
