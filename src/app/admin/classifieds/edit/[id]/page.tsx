import { routes } from "@/config/routes";
import { PageProps } from "@/config/types";
import { validateIdSchema } from "@/schemas/validate-id.schema";
import { redirect } from "next/navigation";
import { prisma } from "../../../../../../prisma/prisma";
import { ClassifiedForm } from "@/components/classified/classified-form";

export default async function EditClassified(props: PageProps) {
  const params = await props.params;
  const { data, success } = validateIdSchema.safeParse({
    id: Number(params?.id),
  });

  if (!success) redirect(routes.admin.classifieds);

  const classified = await prisma.classified.findUnique({
    where: { id: data.id },
    include: { images: true },
  });
  if (!classified) redirect(routes.admin.classifieds);

  return <ClassifiedForm classified={classified} />;
}
