import { FilterOptions } from "@/config/types";
import { useFormContext } from "react-hook-form";
import type { NumericFormatProps } from "react-number-format";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { NumberInput } from "./number-input";
import { cn } from "@/lib/utils";

interface InputSelectProps extends NumericFormatProps {
  inputName: string;
  selectName: string;
  label?: string;
  options: FilterOptions<string, string>;
  prefix?: string;
}

export const InputSelect = ({
  inputName,
  selectName,
  label,
  options,
  className,
  ...numberInputProps
}: InputSelectProps) => {
  const form = useFormContext();
  return (
    <div className="relative w-full">
      <FormField
        control={form.control}
        name={inputName}
        render={({ field: { onChange, ...rest } }) => (
          <FormItem>
            {label && <FormLabel htmlFor={inputName}>{label}</FormLabel>}
            <FormControl>
              <NumberInput
                className={cn(
                  "border-transparent bg-primary-800 text-gray-300",
                  className,
                )}
                onValueChange={(values) => {
                  onChange(values.floatValue);
                }}
                {...rest}
                {...numberInputProps}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={selectName}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...rest } }) => (
          <FormItem>
            <FormControl>
              <div className="absolute right-0 flex h-10 -translate-y-10 items-center border-l border-input border-l-white/10 pr-2">
                <select
                  className={cn(
                    "custom-select appearance-none rounded-md border border-transparent bg-no-repeat pl-3 pr-10 text-gray-500 focus:outline-none focus:ring-0 focus-visible:ring-0 disabled:bg-white/10",
                  )}
                  {...rest}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
};
