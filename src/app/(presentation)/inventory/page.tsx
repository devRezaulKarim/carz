import { AwaitedPageProps, Favorites, PageProps } from "@/config/types";
import { db } from "../../../../prisma/db";
import ClassifiedList from "@/components/inventory/classified-list";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { CustomPagination } from "@/components/shared/Pagination";
import { routes } from "@/config/routes";
import { z } from "zod";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { Sidebar } from "@/components/inventory/sidebar";
import { ClassifiedStatus, Prisma } from "@prisma/client";

const PageSchema = z
  .string()
  .transform((value) => Math.max(1, Number(value)))
  .optional();

const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
});

const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);
  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];
  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };
  const numFilters = ["seats", "doors"];
  const enumFilters = [
    "odoUnit",
    "currency",
    "transmission",
    "bodyType",
    "fuelType",
    "color",
    "ulezCompliance",
  ];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined;
      if (!value) return acc;

      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) };
      } else if (enumFilters.includes(key)) {
        acc[key] = value.toUpperCase();
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters];
        acc[field] = acc[field] || {};
        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as { [key: string]: any },
  );

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...mapParamsToFields,
  };
};

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = PageSchema.parse(searchParams?.page);
  const page = validPage ? validPage : 1;
  const offset = (page - 1) * CLASSIFIED_PER_PAGE;
  return db.classified.findMany({
    where: buildClassifiedFilterQuery(searchParams),
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CLASSIFIED_PER_PAGE,
  });
};

const InventoryPage = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await db.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });
  const minMaxResult = await db.classified.aggregate({
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
  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 bg-white p-4">
        <div className="-mt-1 flex flex-col items-center space-y-2 pb-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="min-w-fit text-sm font-semibold md:text-base lg:text-xl">
              We have found {count} classifieds.
            </h2>
            {/* <DialogFilter/> */}
          </div>

          <CustomPagination
            baseURL={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "flex justify-end",
              paginationLink: "border-none active:border",
              paginationLinkActive: "bg-primary text-white",
              paginationNext: "",
              paginationPrevious: "",
            }}
          />

          <ClassifiedList
            classifieds={classifieds}
            favorites={favorites ? favorites.ids : []}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
