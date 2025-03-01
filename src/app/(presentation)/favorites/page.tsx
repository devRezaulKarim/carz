import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { Favorites, PageProps } from "@/config/types";
import { PageSchema } from "@/schemas/page.schema";
import { db } from "../../../../prisma/db";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import ClassifiedCard from "@/components/inventory/classified-card";
import { CustomPagination } from "@/components/shared/Pagination";
import { routes } from "@/config/routes";

export default async function FavoritesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const validPage = PageSchema.parse(searchParams?.page);
  const page = validPage ? validPage : 1;
  const offset = (page - 1) * CLASSIFIED_PER_PAGE;
  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId ?? "");
  const classifieds = await db.classified.findMany({
    where: { id: { in: favorites ? favorites.ids : [] } },
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CLASSIFIED_PER_PAGE,
  });

  const count = await db.classified.count({
    where: { id: { in: favorites ? favorites.ids : [] } },
  });

  const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

  return (
    <div className="container mx-auto min-h-[80dvh] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your favorite Classifieds</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classifieds.map((classified) => {
          return (
            <ClassifiedCard
              key={classified.id}
              classified={classified}
              favorites={favorites ? favorites.ids : []}
            />
          );
        })}
      </div>
      <div className="mt-8 flex">
        <CustomPagination
          baseURL={routes.favorites}
          totalPages={totalPages}
          styles={{
            paginationRoot: "justify-center",
            paginationLink: "border-none active:border",
            paginationLinkActive: "shadow-md",
            paginationNext: "",
            paginationPrevious: "",
          }}
        />
      </div>
    </div>
  );
}
