import { AwaitedPageProps, Favorites, PageProps } from "@/config/types";
import { db } from "../../../../prisma/db";
import ClassifiedList from "@/components/inventory/classified-list";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { CustomPagination } from "@/components/shared/Pagination";
import { routes } from "@/config/routes";
import { z } from "zod";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";

const pageSchema = z
  .string()
  .transform((value) => Math.max(1, Number(value)))
  .optional();

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = pageSchema.parse(searchParams?.page);
  const page = validPage ? validPage : 1;
  const offset = (page - 1) * CLASSIFIED_PER_PAGE;
  return db.classified.findMany({
    where: {},
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
  const count = await db.classified.count({ where: {} });
  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

  return (
    <div className="flex">
      {/* <Sidebar /> */}
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
