"use client";

import { SortIcon } from "@/components/shared/sort-icon";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sortOrder } from "@/config/constants";
import { ClassifiedKeys, PageProps } from "@/config/types";
import type { Classified } from "@prisma/client";
import { parseAsStringLiteral, useQueryState } from "nuqs";

const classifiedKeys = [
  "status",
  "title",
  "vrm",
  "id",
  "views",
  "year",
  "color",
  "price",
  "createdAt",
];

interface ClassifiedTableProps extends PageProps {
  classifieds: Classified[];
  sort: ClassifiedKeys;
  order: "asc" | "desc";
  currentPage: number;
  totalPage: number;
}

type ClassifiedTableHeaderProps = Pick<ClassifiedTableProps, "sort" | "order">;

export const ClassifiedsTableHeader = ({
  sort: initialSort,
  order: initialOrder,
}: ClassifiedTableHeaderProps) => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(classifiedKeys)
      .withDefault(initialSort)
      .withOptions({ shallow: false }),
  );

  const [order, setOrder] = useQueryState(
    "order",
    parseAsStringLiteral(sortOrder)
      .withDefault(initialOrder)
      .withOptions({ shallow: false }),
  );

  const handleSort = (newSort: ClassifiedKeys) => {
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
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="id"
            />
          </div>
        </TableHead>
        <TableHead className="w-20 text-gray-400">Image</TableHead>

        <TableHead className="min-w-[150px] text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("title")}
            onKeyDown={() => handleSort("title")}
          >
            Title{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="title"
            />
          </div>
        </TableHead>

        <TableHead className="w-[150px] text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("price")}
            onKeyDown={() => handleSort("price")}
          >
            Price{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="price"
            />
          </div>
        </TableHead>

        <TableHead className="hidden w-[150px] text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("vrm")}
            onKeyDown={() => handleSort("vrm")}
          >
            VRM{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="vrm"
            />
          </div>
        </TableHead>

        <TableHead className="hidden w-[150px] text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("color")}
            onKeyDown={() => handleSort("color")}
          >
            Color{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="color"
            />
          </div>
        </TableHead>

        <TableHead className="text-gray-400">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("status")}
            onKeyDown={() => handleSort("status")}
          >
            Status{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="status"
            />
          </div>
        </TableHead>

        <TableHead className="hidden text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("createdAt")}
            onKeyDown={() => handleSort("createdAt")}
          >
            Date Created{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="createdAt"
            />
          </div>
        </TableHead>

        <TableHead className="hidden w-20 text-gray-400 md:table-cell">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSort("views")}
            onKeyDown={() => handleSort("views")}
          >
            Views{" "}
            <SortIcon<ClassifiedKeys>
              currentSort={sort as ClassifiedKeys}
              currentOrder={order as "asc" | "desc" | null}
              sort="views"
            />
          </div>
        </TableHead>
        <TableHead className="w-[100px] text-center text-gray-400">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
