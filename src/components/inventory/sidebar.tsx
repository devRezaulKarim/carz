"use client";
import { routes } from "@/config/routes";
import { SidebarProps } from "@/config/types";
import {
  cn,
  formatBodyType,
  formatColor,
  formatFuelType,
  formatOdoUnit,
  formatTransmission,
  formatULEZCompliance,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "../shared/search-input";
import { TaxonomyFilters } from "./taxonomy-filters";
import { RangeFilters } from "./range-filters";
import {
  BodyType,
  Color,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { Select } from "../ui/select";

const MAX_SAFE_NUMBER = 21474836;
export const defaultQueryStates = {
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
};

export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
  const router = useRouter();
  const { _min, _max } = minMaxValues;
  const [filterCount, setFilterCount] = useState(0);
  const [queryStates, setQueryStates] = useQueryStates(defaultQueryStates, {
    shallow: false,
  });

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
        <RangeFilters
          label="Year"
          minName="minYear"
          maxName="maxYear"
          defaultMin={_min.year || 1925}
          defaultMax={_max.year || new Date().getFullYear()}
          handleChange={handleChange}
          searchParams={searchParams}
        />
        <RangeFilters
          label="Price"
          minName="minPrice"
          maxName="maxPrice"
          defaultMin={Number(_min.price) || 0}
          defaultMax={Number(_max.price) || MAX_SAFE_NUMBER}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000000}
          thousandSeparator
          currency={{
            currencyCode: "USD",
          }}
        />
        <RangeFilters
          label="Odometer Reading"
          minName="minReading"
          maxName="maxReading"
          defaultMin={_min.odoReading || 0}
          defaultMax={_max.odoReading || MAX_SAFE_NUMBER}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={5000}
          thousandSeparator
        />
        <Select
          label="Currency"
          name="currency"
          value={queryStates.currency || ""}
          onChange={handleChange}
          options={Object.values(CurrencyCode).map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Odometer Unit"
          name="odoUnit"
          value={queryStates.odoUnit || ""}
          onChange={handleChange}
          options={Object.values(OdoUnit).map((value) => ({
            label: formatOdoUnit(value),
            value,
          }))}
        />
        <Select
          label="Transmission"
          name="transmission"
          value={queryStates.transmission || ""}
          onChange={handleChange}
          options={Object.values(Transmission).map((value) => ({
            label: formatTransmission(value),
            value,
          }))}
        />
        <Select
          label="Fuel Type"
          name="fuelType"
          value={queryStates.fuelType || ""}
          onChange={handleChange}
          options={Object.values(FuelType).map((value) => ({
            label: formatFuelType(value),
            value,
          }))}
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={queryStates.bodyType || ""}
          onChange={handleChange}
          options={Object.values(BodyType).map((value) => ({
            label: formatBodyType(value),
            value,
          }))}
        />
        <Select
          label="Color"
          name="color"
          value={queryStates.color || ""}
          onChange={handleChange}
          options={Object.values(Color).map((value) => ({
            label: formatColor(value),
            value,
          }))}
        />
        <Select
          label="ULEZ Compliance"
          name="ulezCompliance"
          value={queryStates.ulezCompliance || ""}
          onChange={handleChange}
          options={Object.values(ULEZCompliance).map((value) => ({
            label: formatULEZCompliance(value),
            value,
          }))}
        />
        <Select
          label="Doors"
          name="doors"
          value={queryStates.doors || ""}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, i) => ({
            label: (i + 1).toString(),
            value: (i + 1).toString(),
          }))}
        />
        <Select
          label="Seats"
          name="seats"
          value={queryStates.seats || ""}
          onChange={handleChange}
          options={Array.from({ length: 8 }).map((_, i) => ({
            label: (i + 1).toString(),
            value: (i + 1).toString(),
          }))}
        />
      </div>
    </div>
  );
};
