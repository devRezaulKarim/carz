import { AdminClassifiedsHeader } from "@/components/admin/classifieds/classifieds-header";
import { ClassifiedKeys, PageProps } from "@/config/types";
import { validatePagination } from "@/schemas/pagination.schema";
import { AdminClassifiedsFilterSchema } from "@/schemas/table-filter.schema";
import {
  ClassifiedsTableSortSchema,
  ClassifiedsTableSortType,
  validateSortOrder,
} from "@/schemas/table-sort.schema";
import { prisma } from "../../../../prisma/prisma";
import { Table, TableBody } from "@/components/ui/table";
import { ClassifiedsTableHeader } from "@/components/admin/classifieds/classifieds-table-header";
import { ClassifiedsTableRow } from "@/components/admin/classifieds/classifieds-table-row";
import { AdminTableFooter } from "@/components/shared/admin-table-footer";
import { routes } from "@/config/routes";

export default async function AdminClassifiedsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const { page, itemsPerPage } = validatePagination({
    page: searchParams?.page as string,
    itemsPerPage: searchParams?.itemsPerPage as "10",
  });
  const { sort, order } = validateSortOrder<ClassifiedsTableSortType>({
    sort: searchParams?.sort as ClassifiedKeys,
    order: searchParams?.order as "asc" | "desc",
    schema: ClassifiedsTableSortSchema,
  });
  const offset = (Number(page) - 1) * Number(itemsPerPage);

  const { data, error } = AdminClassifiedsFilterSchema.safeParse(searchParams);

  if (error) {
    console.log("Validation error: ", error);
  }

  const classifieds = await prisma.classified.findMany({
    where: {
      ...(data?.q && { title: { contains: data?.q, mode: "insensitive" } }),
      ...(data?.status && data?.status !== "ALL" && { status: data?.status }),
    },
    orderBy: { [sort as string]: order as "asc" | "desc" },
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: Number(itemsPerPage),
  });

  const count = await prisma.classified.count({
    where: {
      ...(data?.q && { title: { contains: data?.q, mode: "insensitive" } }),
      ...(data?.status && data?.status !== "ALL" && { status: data?.status }),
    },
  });

  const totalPages = Math.ceil(count / Number(itemsPerPage));

  return (
    <>
      <AdminClassifiedsHeader searchParams={searchParams} />
      <Table>
        <ClassifiedsTableHeader
          sort={sort as ClassifiedKeys}
          order={order as "asc" | "desc"}
        />
        <TableBody>
          {classifieds.map((classified) => (
            <ClassifiedsTableRow key={classified.id} classified={classified} />
          ))}
        </TableBody>
        <AdminTableFooter
          baseUrl={routes.admin.classifieds}
          searchParams={searchParams}
          totalPages={totalPages}
          disabled={!classifieds.length}
          cols={10}
        />
      </Table>
    </>
  );
}
export const dynamic = "force-dynamic";
