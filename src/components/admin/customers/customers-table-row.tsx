import { TableCell, TableRow } from "@/components/ui/table";
import { CustomerWithClassifieds } from "@/config/types";
import { format } from "date-fns";
import { CustomersActionButtons } from "./customer-action-buttons";
import { Badge } from "@/components/ui/badge";
import { formatCustomerStatus } from "@/lib/utils";
import { CustomerBadgeMap } from "@/config/constants";

export const CustomersTableRow = ({
  customer,
}: {
  customer: CustomerWithClassifieds;
}) => {
  return (
    <TableRow className="border-white/75 text-gray-300 hover:bg-transparent">
      <TableCell className="font-medium">{customer.id}</TableCell>

      <TableCell className="font-medium">
        <Badge variant={CustomerBadgeMap[customer.status]}>
          {formatCustomerStatus(customer.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {customer.firstName} {customer.lastName}
      </TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell className="hidden md:table-cell">{customer.mobile}</TableCell>
      <TableCell className="hidden md:table-cell">
        {customer.classified?.title}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {" "}
        {format(customer.createdAt, "dd MMM yyy HH:mm")}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {" "}
        {format(customer.updatedAt, "dd MMM yyy HH:mm")}
      </TableCell>
      <TableCell>
        {customer.bookingDate
          ? format(customer.bookingDate, "dd MMM yyy HH:mm")
          : "N/A"}
      </TableCell>
      <TableCell>
        <CustomersActionButtons customer={customer} />
      </TableCell>
    </TableRow>
  );
};
