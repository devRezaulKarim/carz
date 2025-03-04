"use client";

import { SidebarProps } from "@/config/types";

import { useQueryStates } from "nuqs";
import { defaultQueryStates } from "../inventory/sidebar";
import { ChangeEvent } from "react";
import { TaxonomyFilters } from "../inventory/taxonomy-filters";
import { RangeFilters } from "../inventory/range-filters";

const MAX_SAFE_NUMBER = 21474836;
type HomepageFiltersProps = SidebarProps;

export const HomepageFilters = ({
  minMaxValues,
  searchParams,
}: HomepageFiltersProps) => {
  const { _min, _max } = minMaxValues;
  const [, setState] = useQueryStates(defaultQueryStates, { shallow: false });

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "make":
        await setState({
          make: value,
          model: null,
          modelVariant: null,
        });
        break;
      case "model":
        await setState({
          model: value,
          modelVariant: null,
        });
        break;

      default:
        await setState({
          [name]: value,
        });
        break;
    }
  };

  return (
    <>
      <TaxonomyFilters
        handleChange={handleChange}
        searchParams={searchParams}
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
    </>
  );
};
