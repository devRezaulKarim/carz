import { ClassifiedKeys, CustomerKeys, PageProps } from "@/config/types";
import { validatePagination } from "@/schemas/pagination.schema";
import { AdminCustomersFilterSchema } from "@/schemas/table-filter.schema";
import {
  CustomersTableSortSchema,
  CustomersTableSortType,
  validateSortOrder,
} from "@/schemas/table-sort.schema";
import { prisma } from "../../../../prisma/prisma";
import { Table, TableBody } from "@/components/ui/table";
import { AdminTableFooter } from "@/components/shared/admin-table-footer";
import { routes } from "@/config/routes";
import { AdminCustomersHeader } from "@/components/admin/customers/customers-header";
import { CustomersTableHeader } from "@/components/admin/customers/customers-table-header";
import { CustomersTableRow } from "@/components/admin/customers/customers-table-row";

export default async function AdminCustomersPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const { page, itemsPerPage } = validatePagination({
    page: searchParams?.page as string,
    itemsPerPage: searchParams?.itemsPerPage as "10",
  });
  const { sort, order } = validateSortOrder<CustomersTableSortType>({
    sort: searchParams?.sort as ClassifiedKeys,
    order: searchParams?.order as "asc" | "desc",
    schema: CustomersTableSortSchema,
  });
  const offset = (Number(page) - 1) * Number(itemsPerPage);

  const { data, error } = AdminCustomersFilterSchema.safeParse(searchParams);

  if (error) {
    console.log("Validation error: ", error);
  }

  const customers = await prisma.customer.findMany({
    where: {
      ...(data?.q && { title: { contains: data?.q, mode: "insensitive" } }),
      ...(data?.status && data?.status !== "ALL" && { status: data?.status }),
    },
    orderBy: { [sort as string]: order as "asc" | "desc" },
    include: {
      classified: true,
    },
    skip: offset,
    take: Number(itemsPerPage),
  });

  const count = await prisma.customer.count({
    where: {
      ...(data?.q && { title: { contains: data?.q, mode: "insensitive" } }),
      ...(data?.status && data?.status !== "ALL" && { status: data?.status }),
    },
  });

  const totalPages = Math.ceil(count / Number(itemsPerPage));

  return (
    <>
      <AdminCustomersHeader searchParams={searchParams} />
      <Table>
        <CustomersTableHeader
          sort={sort as CustomerKeys}
          order={order as "asc" | "desc"}
        />
        <TableBody>
          {customers.map((customer) => (
            <CustomersTableRow key={customer.id} customer={customer} />
          ))}
        </TableBody>
        <AdminTableFooter
          baseUrl={routes.admin.customers}
          searchParams={searchParams}
          totalPages={totalPages}
          disabled={!customers.length}
          cols={10}
        />
      </Table>
    </>
  );
}
export const dynamic = "force-dynamic";
