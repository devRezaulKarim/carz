"use client";

import { SortIcon } from "@/components/shared/sort-icon";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sortOrder } from "@/config/constants";
import { CustomerKeys, PageProps } from "@/config/types";
import { Customer } from "@prisma/client";
import { parseAsStringLiteral, useQueryState } from "nuqs";

const customerKeys = [
  "id",
  "email",
  "mobile",
  "firstName",
  "lastName",
  "updatedAt",
  "createdAt",
  "status",
  "bookingDate",
  "classified",
];

interface CustomerTableProps extends PageProps {
  customers: Customer[];
  sort: CustomerKeys;
  order: "asc" | "desc";
  currentPage: number;
  totalPage: number;
}

type CustomerTableHeaderProps = Pick<CustomerTableProps, "sort" | "order">;

export const CustomersTableHeader = ({
  sort: initialSort,
  order: initialOrder,
}: CustomerTableHeaderProps) => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(customerKeys)
      .withDefault(initialSort)
      .withOptions({ shallow: false }),
  );

  const [order, setOrder] = useQueryState(
    "order",
    parseAsStringLiteral(sortOrder)
      .withDefault(initialOrder)
      .withOptions({ shallow: false }),
  );

  const handleSort = (newSort: CustomerKeys) => {
    if (newSort === sort) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(newSort);
      setOrder("asc");
    }
  };
  return (
    <TableHeader>
      <TableRow className="border-primary-800 hover:bg-transparent">
        <TableHead className="w-20 text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("id")}
            onKeyDown={() => handleSort("id")}
          >
            ID{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="id"
            />
          </div>
        </TableHead>
        {/* <TableHead className="w-20 text-gray-400">Image</TableHead> */}

        <TableHead className="text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("status")}
            onKeyDown={() => handleSort("status")}
          >
            Status{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="status"
            />
          </div>
        </TableHead>

        <TableHead className="min-w-36 text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("firstName")}
            onKeyDown={() => handleSort("firstName")}
          >
            Name{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="firstName"
            />
          </div>
        </TableHead>

        <TableHead className="text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("email")}
            onKeyDown={() => handleSort("email")}
          >
            Email{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="email"
            />
          </div>
        </TableHead>

        <TableHead className="hidden text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("mobile")}
            onKeyDown={() => handleSort("mobile")}
          >
            Mobile{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="mobile"
            />
          </div>
        </TableHead>
        <TableHead className="hidden w-[150px] text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("classified")}
            onKeyDown={() => handleSort("classified")}
          >
            Classified{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="classified"
            />
          </div>
        </TableHead>
        <TableHead className="hidden text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap"
            onClick={() => handleSort("createdAt")}
            onKeyDown={() => handleSort("createdAt")}
          >
            Date Created{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="createdAt"
            />
          </div>
        </TableHead>
        <TableHead className="hidden text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap"
            onClick={() => handleSort("updatedAt")}
            onKeyDown={() => handleSort("updatedAt")}
          >
            Date Updated{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="updatedAt"
            />
          </div>
        </TableHead>

        <TableHead className="w-20 text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap"
            onClick={() => handleSort("bookingDate")}
            onKeyDown={() => handleSort("bookingDate")}
          >
            Booking Date{" "}
            <SortIcon<CustomerKeys>
              currentSort={sort as CustomerKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="bookingDate"
            />
          </div>
        </TableHead>
        <TableHead className="min-w-[100px] text-center text-gray-400">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
