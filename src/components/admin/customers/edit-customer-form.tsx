"use client";

import { updateCustomerAction } from "@/actions/customer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { formatCustomerStatus } from "@/lib/utils";
import {
  EditCustomerType,
  EditCustomerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerStatus, type Customer } from "@prisma/client";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const EditCustomerForm = ({ customer }: { customer: Customer }) => {
  const [, startTransition] = useTransition();
  const form = useForm<EditCustomerType>({
    resolver: zodResolver(EditCustomerSchema),
    defaultValues: {
      status: customer.status,
    },
  });
  const onChangeHandler: SubmitHandler<EditCustomerType> = (data) => {
    startTransition(async () => {
      const { success, message } = await updateCustomerAction({
        id: customer.id,
        status: data.status,
      });

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
  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChangeHandler)}>
        <FormField
          control={form.control}
          name="status"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, ...rest } }) => (
            <FormItem>
              <FormLabel className="text-gray-300" htmlFor="status">
                Customer Status
              </FormLabel>
              <FormControl>
                <Select
                  selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                  options={Object.values(CustomerStatus).map((status) => ({
                    label: formatCustomerStatus(status),
                    value: status,
                  }))}
                  noDefault={true}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
