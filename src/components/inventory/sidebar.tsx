"use client";
import { routes } from "@/config/routes";
import { AwaitedPageProps } from "@/config/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "../shared/search-input";
import { TaxonomyFilters } from "./taxonomy-filters";

interface SidebarProps extends AwaitedPageProps {
  minMaxValues: any;
}
export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
  const router = useRouter();
  const [filterCount, setFilterCount] = useState(0);
  const [queryStates, setQueryStates] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
      minReading: parseAsString.withDefault(""),
      maxReading: parseAsString.withDefault(""),
      currency: parseAsString.withDefault(""),
      odoUnit: parseAsString.withDefault(""),
      transmission: parseAsString.withDefault(""),
      fuelType: parseAsString.withDefault(""),
      bodyType: parseAsString.withDefault(""),
      color: parseAsString.withDefault(""),
      doors: parseAsString.withDefault(""),
      seats: parseAsString.withDefault(""),
      ulezCompliance: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    },
  );

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>,
    ).filter(([key, value]) => key !== "page" && value).length;
    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL(routes.inventory, process.env.NEXT_PUBLIC_APP_URL);
    window.location.replace(url.toString());
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null });
    if (name === "make") {
      setQueryStates({ model: null, modelVariant: null });
    }
    router.refresh();
  };

  return (
    <div className="hidden w-[21.25rem] border-r border-muted bg-white py-4 lg:block">
      <div>
        <div className="flex items-center justify-between px-4 text-lg font-semibold">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!filterCount}
            aria-disabled={!filterCount}
            className={cn(
              "py-1 text-sm text-gray-500",
              !filterCount
                ? "disabled pointers-events-none cursor-default opacity-50"
                : "cursor-pointer hover:underline",
            )}
          >
            Clear all {filterCount ? `(${filterCount})` : null}
          </button>
        </div>
      </div>
      <div className="mt-2 p-4">
        <SearchInput placeholder="Search Classified" />
      </div>
      <div className="space-y-2 p-4">
        <TaxonomyFilters
          searchParams={searchParams}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};
