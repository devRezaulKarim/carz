import { cn } from "@/lib/utils";
import { ChangeEvent, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  noDefault?: boolean;
}
export const Select = ({
  label,
  value,
  options,
  onChange,
  className,
  selectClassName,
  noDefault,
  ...rest
}: SelectProps) => {
  return (
    <div className={cn("mt-1", className)}>
      {label && <h4 className="text-sm font-semibold">{label}</h4>}
      <div className="mt-1">
        <select
          onChange={onChange}
          value={value ?? ""}
          className={cn(
            "custom-select w-full appearance-none rounded-md border border-input bg-no-repeat px-3 py-2 pr-12 focus:outline-none disabled:!bg-gray-100",
            selectClassName,
          )}
          {...rest}
        >
          {!noDefault && <option value="">Select</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
