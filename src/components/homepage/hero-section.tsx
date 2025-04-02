import { imageSource } from "@/config/constants";
import PageTitle from "../ui/pageTitle";
import { HomepageFilters } from "./homepage-filters";
import { SearchButton } from "./searech-button";
import { AwaitedPageProps } from "@/config/types";
import { prisma } from "../../../prisma/prisma";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { routes } from "@/config/routes";
import { ClassifiedStatus } from "@prisma/client";

export const HeroSection = async ({ searchParams }: AwaitedPageProps) => {
  const totalFiltersApplied = Object.keys(searchParams || {}).length;
  const isFilterApplied = totalFiltersApplied > 0;

  const classifiedsCount = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });
  const minMaxResult = await prisma.classified.aggregate({
    where: {
      status: ClassifiedStatus.LIVE,
    },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      year: true,
      price: true,
      odoReading: true,
    },
  });
  return (
    <section
      style={{
        background: `url(${imageSource.carLineup})`,
        backgroundPosition: "center",
      }}
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cover"
    >
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="container relative z-10 grid-cols-2 items-center space-y-12 py-10 md:py-0 lg:grid">
        <div className="px-10 lg:px-0">
          <PageTitle
            text="Unbeatable Deals on New & Used cars"
            className="text-center font-extrabold uppercase text-white md:text-4xl lg:text-left lg:text-6xl"
          />
          <h2 className="mt-4 text-center text-base uppercase text-white md:text-3xl lg:text-left lg:text-4xl">
            Discover your dream car today
          </h2>
        </div>
        <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex w-full flex-col gap-x-4 space-y-2">
              <HomepageFilters
                minMaxValues={minMaxResult}
                searchParams={searchParams}
              />
            </div>
            <SearchButton count={classifiedsCount} />
            {isFilterApplied && (
              <Button
                asChild
                variant="outline"
                className="w-full hover:bg-slate-200 hover:text-black"
              >
                <Link href={routes.home}>
                  Clear Filters ({totalFiltersApplied})
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
