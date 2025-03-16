"use client";

import { useQueryState } from "nuqs";
import { ChangeEvent, InputHTMLAttributes, useCallback, useRef } from "react";
import debounce from "debounce";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounceFunc<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  opts: { immediate: boolean },
) {
  return debounce(func, wait, opts);
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = ({ className, ...rest }: SearchInputProps) => {
  const [q, setSearch] = useQueryState("q", { shallow: false });
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounceFunc(
      (val: string) => {
        setSearch(val || null);
      },
      1000,
      { immediate: false },
    ),
    [],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      action=""
      className="relative flex-1"
    >
      <SearchIcon className="absolute left-[10px] top-3 h-4 w-4 text-gray-500" />
      <Input
        ref={inputRef}
        defaultValue={q || ""}
        className={cn(className, "pl-8")}
        onChange={onChange}
        type="text"
        {...rest}
      />
      {q && (
        <XIcon
          className="absolute right-[10px] top-3 h-4 w-4 cursor-pointer rounded-full bg-gray-500 p-[2px] text-white"
          onClick={clearSearch}
        />
      )}
    </form>
  );
};
