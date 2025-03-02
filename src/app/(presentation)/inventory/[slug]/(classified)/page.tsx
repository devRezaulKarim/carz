import { PageProps } from "@/config/types";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../../../../prisma/db";
import { ClassifiedStatus } from "@prisma/client";
import { routes } from "@/config/routes";
import { ClassifiedView } from "@/components/classified/classified-view";

export default async function ClassifiedPage(props: PageProps) {
  const params = await props?.params;

  const slug = decodeURIComponent(params?.slug as string);

  if (!slug) notFound();

  const classified = await db.classified.findUnique({
    where: { slug },
    include: { make: true, images: true },
  });
  if (!classified) notFound();
  if (classified.status === ClassifiedStatus.SOLD)
    redirect(routes.notAvailable(slug));
  return <ClassifiedView {...classified} />;
}
