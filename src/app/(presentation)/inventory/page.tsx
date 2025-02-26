import { AwaitedPageProps, Favorites, PageProps } from "@/config/types";
import { db } from "../../../../prisma/db";
import ClassifiedList from "@/components/inventory/classified-list";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return db.classified.findMany({
    include: {
      images: true,
    },
  });
};

const InventoryPage = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);

  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId ?? "");

  return (
    <>
      <ClassifiedList classifieds={classifieds} favorites={favorites? favorites.ids :[]} />
    </>
  );
};

export default InventoryPage;
