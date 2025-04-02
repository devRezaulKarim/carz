import { routes } from "@/config/routes";
import { PageProps } from "@/config/types";
import { validateIdSchema } from "@/schemas/validate-id.schema";
import { redirect } from "next/navigation";
import { prisma } from "../../../../../../prisma/prisma";
import { EditCustomerForm } from "@/components/admin/customers/edit-customer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerBadgeMap } from "@/config/constants";
import { formatCustomerStatus } from "@/lib/utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function EditCustomer(props: PageProps) {
  const params = await props.params;

  const { data, success } = validateIdSchema.safeParse({
    id: Number(params?.id),
  });

  if (!success) redirect(routes.admin.customers);

  const customer = await prisma.customer.findUnique({
    where: { id: data.id },
    include: { classified: true, lifecycle: true },
  });
  if (!customer) redirect(routes.admin.customers);

  return (
    <>
      <div className="container mx-auto flex flex-col space-y-4 p-6 text-muted">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Edit customer</h1>
          <EditCustomerForm customer={customer} />
        </div>
      </div>

      <div className="container space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl tracking-wider text-gray-100 md:text-2xl">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-gray-300">
              <div>
                <strong className="tracking-wider">Name: </strong>{" "}
                {customer.firstName} {customer.lastName}
              </div>
              <div>
                <strong className="tracking-wider">Email: </strong>{" "}
                {customer.email}
              </div>
              <div>
                <strong className="tracking-wider">Mobile: </strong>{" "}
                {customer.mobile}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl tracking-wider text-gray-100 md:text-2xl">
                Customer Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-gray-300">
              <div>
                <strong className="tracking-wider">Status: </strong>{" "}
                <Badge variant={CustomerBadgeMap[customer.status]}>
                  {formatCustomerStatus(customer.status)}
                </Badge>
              </div>
              <div>
                <strong className="tracking-wider">Terms Accepted: </strong>{" "}
                {customer.termsAccepted ? "Yes" : "No"}
              </div>
              <div>
                <strong className="tracking-wider">Booking Date: </strong>{" "}
                {customer.bookingDate
                  ? format(customer.bookingDate, "dd MMM yyy HH:mm")
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl tracking-wider text-gray-100 md:text-2xl">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-gray-300">
            <div>
              <strong className="tracking-wider">Customer ID: </strong>{" "}
              {customer.id}
            </div>
            <div>
              <strong className="tracking-wider">Classified Title: </strong>{" "}
              {customer.classified?.title}
            </div>
            <div>
              <strong className="tracking-wider">Created: </strong>{" "}
              {format(customer.createdAt, "dd MMM yyy HH:mm")}
            </div>
            <div>
              <strong className="tracking-wider">Last Updated: </strong>{" "}
              {format(customer.updatedAt, "dd MMM yyy HH:mm")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl tracking-wider text-gray-100 md:text-2xl">
              Customer Lifecycle
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-gray-300">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base font-semibold tracking-wider text-gray-300">
                    Date
                  </TableHead>
                  <TableHead className="text-base font-semibold tracking-wider text-gray-300">
                    Old Status
                  </TableHead>
                  <TableHead className="text-base font-semibold tracking-wider text-gray-300">
                    New Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.lifecycle.map((entry) => (
                  <TableRow className="text-gray-400" key={entry.id}>
                    <TableCell>
                      {format(entry.createdAt, "dd MMM yyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {formatCustomerStatus(entry.oldStatus)}
                    </TableCell>
                    <TableCell>
                      {formatCustomerStatus(entry.newStatus)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
