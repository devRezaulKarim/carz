"use client";
import { useQueryStates } from "nuqs";
import { defaultQueryStates } from "../inventory/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { routes } from "@/config/routes";

export const SearchButton = ({ count }: { count: number }) => {
  const [{ make, model, modelVariant, minPrice, maxPrice, minYear, maxYear }] =
    useQueryStates(defaultQueryStates, { shallow: false });

  const queryParams = new URLSearchParams();
  if (make) queryParams.append("make", make);
  if (model) queryParams.append("model", model);
  if (modelVariant) queryParams.append("modelVariant", modelVariant);
  if (minPrice) queryParams.append("minPrice", minPrice);
  if (maxPrice) queryParams.append("maxPrice", maxPrice);
  if (minYear) queryParams.append("minYear", minYear);
  if (maxYear) queryParams.append("maxYear", maxYear);

  const url = new URL(routes.inventory, process.env.NEXT_PUBLIC_APP_URL);
  url.search = queryParams.toString();

  return (
    <Button asChild className="w-full">
      <Link href={url.toString()}>
        Search {count > 0 ? `(${count})` : null}
      </Link>
    </Button>
  );
};
