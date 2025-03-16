import { ClassifiedStatus } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { LatestArrivalsCarousel } from "./latest-arrivals-carousel";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { Favorites } from "@/config/types";

export const LatestArrivals = async () => {
  const classifieds = await prisma.classified.findMany({
    where: {
      status: ClassifiedStatus.LIVE,
    },
    take: 6,
    include: {
      images: true,
    },
  });
  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId || "");
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-[80vw]">
        <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-gray-900 sm:text-4xl">
          Latest Arrivals
        </h2>
        <LatestArrivalsCarousel
          classifieds={classifieds}
          favorites={favorites ? favorites.ids : []}
        />
      </div>
    </section>
  );
};
