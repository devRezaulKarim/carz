"use client";

import { SidebarProps } from "@/config/types";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { defaultQueryStates } from "./sidebar";
import { routes } from "@/config/routes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Settings2 } from "lucide-react";
import { Select } from "../ui/select";
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
import {
  cn,
  formatBodyType,
  formatColor,
  formatFuelType,
  formatOdoUnit,
  formatTransmission,
  formatULEZCompliance,
} from "@/lib/utils";

interface DialogFiltersProps extends SidebarProps {
  count: number;
}
const MAX_SAFE_NUMBER = 21474836;

export const DialogFilters = ({
  minMaxValues,
  searchParams,
  count,
}: DialogFiltersProps) => {
  const { _min, _max } = minMaxValues;
  const [open, setOpen] = useState(false);
  const router = useRouter();
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
    router.replace(url.toString());
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-sm overflow-y-auto rounded-xl">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <DialogTitle>Filters</DialogTitle>
            </div>
          </div>
          <div className="">
            <SearchInput placeholder="Search Classified" />
          </div>
          <div className="space-y-2">
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
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Search {count ? `(${count})` : null}
            </Button>
            {filterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className={cn(
                  "py-1 text-sm",
                  !filterCount
                    ? "disabled pointer-events-none cursor-default opacity-50"
                    : "hover:underline",
                )}
                aria-disabled={!filterCount}
                disabled={!filterCount}
              >
                Clear all {filterCount ? `(${filterCount})` : null}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
