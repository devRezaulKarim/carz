"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export const FormHeader = () => {
  const params = useSearchParams();
  const steps = [
    { id: "1", title: "Welcome" },
    { id: "2", title: "Select Handover Date" },
    { id: "3", title: "Submit Details" },
  ];
  return (
    <div className="flex justify-between bg-primary p-4 shadow-lg">
      <div className="flex flex-1 flex-col justify-between">
        <h1 className="text-xl font-bold text-white md:text-2xl xl:text-3xl">
          {steps.find(({ id }) => params.get("step") === id)?.title}
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 text-sm font-medium text-muted-foreground">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full",
              params.get("step") === step.id
                ? "bg-white"
                : "bg-primary text-primary-foreground",
            )}
          >
            {step.id}
          </div>
        ))}
      </div>
    </div>
  );
};
