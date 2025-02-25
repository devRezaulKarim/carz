import { AwaitedPageProps, PageProps } from "@/config/types";
import { db } from "../../../../prisma/db";
import ClassifiedList from "@/components/inventory/classified-list";

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
  console.log(classifieds);
  return (
    <>
      <ClassifiedList classifieds={classifieds} />
    </>
  );
};

export default InventoryPage;
