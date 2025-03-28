"use client";
import { AwaitedPageProps } from "@/config/types";
import { ClassifiedStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface RadioFilterProps extends AwaitedPageProps {
  items: string[];
}
export const RadioFilter = ({ items, searchParams }: RadioFilterProps) => {
  const router = useRouter();
  const status = (searchParams?.status as string) || "all";

  const handleStatus = (status: Lowercase<ClassifiedStatus>) => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("status", status.toUpperCase());
    const url = new URL(window.location.href);
    url.search = currentUrlParams.toString();
    router.push(url.toString());
  };

  return (
    <RadioGroup
      onValueChange={handleStatus}
      defaultValue="all"
      className="flex items-center gap-4"
    >
      {items.map((item) => (
        <Label
          key={item}
          htmlFor={item.toLowerCase()}
          className={cn(
            "flex-1 cursor-pointer rounded-md px-4 py-2 text-center text-sm font-medium text-muted transition-colors hover:bg-primary-800",
            status?.toLowerCase() === item.toLowerCase() &&
              "bg-primary-800 text-white",
          )}
        >
          <RadioGroupItem
            id={item.toLowerCase()}
            value={item.toLowerCase()}
            checked={status?.toLowerCase() === item.toLowerCase()}
            className="peer sr-only"
          />
          {item}
        </Label>
      ))}
    </RadioGroup>
  );
};
