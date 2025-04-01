"use client";
import { updateClassifiedAction } from "@/actions/classified";
import { ClassifiedWithImage } from "@/config/types";
import {
  UpdateClassifiedType,
  updateClassifiedSchema,
} from "@/schemas/classified.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { ClassifiedFormFields } from "./classified-form-fields";
import { ClassifiedStatus, CurrencyCode, OdoUnit } from "@prisma/client";
import { Select } from "../ui/select";
import { MAX_IMAGES } from "@/config/constants";
import { formatClassifiedStatus } from "@/lib/utils";
import { MultiImageUploader } from "./multi-image-uploader";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ClassifiedFormProps {
  classified: ClassifiedWithImage;
}

export const ClassifiedForm = ({ classified }: ClassifiedFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateClassifiedType>({
    resolver: zodResolver(updateClassifiedSchema),
    defaultValues: {
      id: classified.id,
      odoUnit: OdoUnit.KILOMETERS,
      currency: CurrencyCode.USD,
      images: classified.images ? classified.images : [],
      make: classified.makeId.toString(),
      model: classified.modelId.toString(),
      modelVariant: classified.modelVariantId?.toString(),
      year: classified.year?.toString(),
      vrm: classified.vrm ?? "",
      description: classified.description ?? "",
      fuelType: classified.fuelType,
      bodyType: classified.bodyType,
      transmission: classified.transmission,
      color: classified.color,
      ulezCompliance: classified.ulezCompliance,
      status: classified.status,
      odoReading: classified.odoReading,
      seats: classified.seats,
      doors: classified.doors,
      price: classified.price / 100,
    },
  });

  const classifiedFormSubmit: SubmitHandler<UpdateClassifiedType> = (data) => {
    console.log({ data });
    startTransition(async () => {
      const { success, message } = await updateClassifiedAction(data);
      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 3000,
          position: "top-right",
          closeButton: true,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(classifiedFormSubmit)}>
        <h1 className="mb-6 text-3xl font-bold text-muted">Upload Vehicle</h1>
        <div className="mx-auto grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <ClassifiedFormFields />

          {/* Right side image uploader */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { ref, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-gray-300" htmlFor="images">
                    Images (up to {MAX_IMAGES})
                  </FormLabel>
                  <FormControl>
                    <MultiImageUploader />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { ref, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-gray-300" htmlFor="status">
                    Status
                  </FormLabel>
                  <FormControl>
                    <Select
                      selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                      options={Object.values(ClassifiedStatus).map(
                        (status) => ({
                          label: formatClassifiedStatus(status),
                          value: status,
                        }),
                      )}
                      noDefault={true}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="flex w-full items-center gap-2"
            >
              {" "}
              {isPending && <Loader2 className="!h-4 !w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
