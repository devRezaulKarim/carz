import { cn } from "@/lib/utils";
import React from "react";

type PageTitleProps = {
  text: string;
  className?: string;
};

const PageTitle = ({ text, className }: PageTitleProps) => {
  return (
    <h1 className={cn("text-2xl font-bold", className)}>
      {text}
    </h1>
  );
};

export default PageTitle;
