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
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { routes } from "@/config/routes";
import { generateDateOptions, generateTimeOptions } from "@/lib/utils";
import {
  SelectDateSchema,
  SelectDateType,
} from "@/schemas/multi-step-form.schema";

export const SelectDate = ({
  searchParams,
  classified,
}: MultiStepFormComponentProps) => {
  const handoverDate = (searchParams?.handOverDate as string) ?? undefined;
  const handoverTime = (searchParams?.handOverTime as string) ?? undefined;
  const router = useRouter();
  const form = useForm<SelectDateType>({
    resolver: zodResolver(SelectDateSchema),
    mode: "onBlur",
    defaultValues: {
      handoverDate: handoverDate
        ? decodeURIComponent(handoverDate)
        : handoverDate,
      handoverTime: handoverTime
        ? decodeURIComponent(handoverTime)
        : handoverTime,
    },
  });
  console.log({ handoverDate, handoverTime });
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.WELCOME.toString());
      router.push(url.toString());
    });
  };

  //This will be called while submitting the form
  const onSelectDate: SubmitHandler<SelectDateType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const url = new URL(
        routes.reserve(classified.slug, MultiStepFormEnum.SUBMIT_DETAILS),
        process.env.NEXT_PUBLIC_APP_URL,
      );
      url.searchParams.set(
        "handoverDate",
        encodeURIComponent(data.handoverDate),
      );
      url.searchParams.set(
        "handoverTime",
        encodeURIComponent(data.handoverTime),
      );
      router.push(url.toString());
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSelectDate)}
        className="mx-auto flex h-96 flex-col rounded-b-lg bg-white p-6 shadow-lg"
      >
        <div className="flex-1 space-y-6">
          <FormField
            control={form.control}
            name="handoverDate"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverDate">Select a Date</FormLabel>
                <FormControl>
                  <Select options={generateDateOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handoverTime"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverTime">Select a Time</FormLabel>
                <FormControl>
                  <Select options={generateTimeOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
