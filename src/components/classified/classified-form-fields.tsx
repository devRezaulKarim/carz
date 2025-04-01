import {
  formatBodyType,
  formatColor,
  formatFuelType,
  formatOdoUnit,
  formatTransmission,
  formatULEZCompliance,
  generateYears,
} from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select } from "../ui/select";
import { TaxonomySelects } from "./taxonomy-selects";
import { InputSelect } from "../ui/input-select";
import {
  BodyType,
  Color,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { Input } from "../ui/input";
import { NumberInput } from "../ui/number-input";

import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => {
      return (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-24 bg-primary-800" />
          <Skeleton className="h-[200px] w-full bg-primary-800" />
        </div>
      );
    },
  },
);

const years = generateYears(1925);

export const ClassifiedFormFields = () => {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-4 text-muted md:grid-cols-2">
      <FormField
        control={form.control}
        name="year"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="year">Year</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={years.map((value) => ({ value, label: value }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <TaxonomySelects />
      <InputSelect
        options={Object.values(CurrencyCode).map((v) => ({
          label: v,
          value: v,
        }))}
        label="Price"
        inputName="price"
        selectName="currency"
        inputMode="numeric"
        placeholder="0"
        className="h-10"
      />
      <InputSelect
        options={Object.values(OdoUnit).map((v) => ({
          label: formatOdoUnit(v),
          value: v,
        }))}
        label="Odometer Reading"
        inputName="odoReading"
        selectName="odoUnit"
        inputMode="numeric"
        placeholder="0"
        className="h-10"
      />
      <FormField
        control={form.control}
        name="transmission"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="transmission">Transmission</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={Object.values(Transmission).map((value) => ({
                  label: formatTransmission(value),
                  value,
                }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fuelType"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="fuelType">Fuel Type</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={Object.values(FuelType).map((value) => ({
                  label: formatFuelType(value),
                  value,
                }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bodyType"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="bodyType">Body Type</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={Object.values(BodyType).map((value) => ({
                  label: formatBodyType(value),
                  value,
                }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="color"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="color">Color</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={Object.values(Color).map((value) => ({
                  label: formatColor(value),
                  value,
                }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ulezCompliance"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="ulezCompliance">ULEZ Compliance</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={Object.values(ULEZCompliance).map((value) => ({
                  label: formatULEZCompliance(value),
                  value,
                }))}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vrm"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="vrm">Vehicle Registration Mark</FormLabel>
            <FormControl>
              <Input
                placeholder="LA16 PYW"
                className="border-transparent !bg-primary-800 uppercase text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="doors"
        render={({ field: { onChange, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="doors">Doors</FormLabel>
            <FormControl>
              <NumberInput
                max={6}
                min={1}
                placeholder="0"
                onValueChange={(values) => {
                  onChange(values.floatValue);
                }}
                className="border-transparent bg-primary-800 uppercase text-gray-300 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seats"
        render={({ field: { onChange, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="seats">Seats</FormLabel>
            <FormControl>
              <NumberInput
                max={12}
                min={2}
                placeholder="0"
                onValueChange={(values) => {
                  onChange(values.floatValue);
                }}
                className="border-transparent bg-primary-800 uppercase text-gray-300 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="description"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor
                  label="Description"
                  config={{
                    init: { placeholder: "Enter your vehicle description" },
                  }}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
