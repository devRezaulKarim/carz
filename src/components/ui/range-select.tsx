"use client";

import { FilterOptions } from "@/config/types";
import { SelectHTMLAttributes } from "react";

interface SelectType extends SelectHTMLAttributes<HTMLSelectElement> {
  options: FilterOptions<string, number>;
}

interface RangeSelectProps {
  label: string;
  minSelect: SelectType;
  maxSelect: SelectType;
}
export const RangeSelect = ({
  label,
  minSelect,
  maxSelect,
}: RangeSelectProps) => {
  return (
    <>
      <h4 className="text-sm font-semibold">{label}</h4>
      <div className="!mt-1 flex gap-2">
        <select
          {...minSelect}
          className="custom-select w-full flex-1 appearance-none rounded-md border bg-no-repeat py-2 pl-3 pr-12"
        >
          <option value="">Select</option>
          {minSelect.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          {...maxSelect}
          className="custom-select w-full flex-1 appearance-none rounded-md border bg-no-repeat py-2 pl-3 pr-12"
        >
          <option value="">Select</option>
          {maxSelect.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
