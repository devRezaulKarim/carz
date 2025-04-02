"use client";

import { AwaitedPageProps, FilterOptions } from "@/config/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";
import { TableCell, TableFooter, TableRow } from "../ui/table";
import { Select } from "../ui/select";
import { CustomPagination } from "./Pagination";

interface AdminTableFooterProps extends AwaitedPageProps {
  disabled: boolean;
  totalPages: number;
  baseUrl: string;
  cols: number;
}

const itemsPerPageOptions: FilterOptions<string, string> = [
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export const AdminTableFooter = ({
  baseUrl,
  cols,
  disabled,
  totalPages,
  searchParams,
}: AdminTableFooterProps) => {
  const itemsPerPage = searchParams?.itemsPerPage || "10";
  const router = useRouter();

  const handleItemsPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set(e.target.name, e.target.value);
    const url = new URL(window.location.href);
    url.search = currentUrlParams.toString();
    router.push(url.toString());
  };

  useEffect(() => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("itemsPerPage", itemsPerPage as string);

    const url = new URL(window.location.href);
    url.search = currentUrlParams.toString();
    router.push(url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage]);

  return (
    <TableFooter className="border-primary-800 hover:bg-transparent">
      <TableRow className="bg-primary-900 hover:bg-transparent">
        <TableCell colSpan={cols}>
          <div className="flex items-center">
            <Select
              name="itemsPerPage"
              value={searchParams?.itemsPerPage as string}
              onChange={handleItemsPerPage}
              options={itemsPerPageOptions}
              disabled={disabled}
              className="-mt-1 min-w-[90px]"
              noDefault={true}
              selectClassName="!bg-primary-800 text-gray-300 border-primary-800 disabled:!bg-gray-600"
            />
            <CustomPagination
              totalPages={totalPages}
              baseURL={baseUrl}
              styles={{
                paginationRoot: "justify-end",
                paginationPrevious:
                  "border-none hover:bg-primary-800 text-gray-300",
                paginationNext: "hover:bg-primary-800 text-gray-300",
                paginationLink:
                  "border-none hover:bg-primary-800 text-gray-300",
                paginationLinkActive: "bg-primary-800 text-white",
              }}
            />
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};
