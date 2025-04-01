import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "lucide-react";

interface SortIconProps<TKeys> {
  sort: TKeys;
  currentSort: TKeys | null;
  currentOrder: "asc" | "desc" | null;
}
export function SortIcon<TKeys>({
  currentOrder,
  currentSort,
  sort,
}: SortIconProps<TKeys>) {
  if (sort !== currentSort) {
    return <ArrowUpDown className="!h-4 !w-4" />;
  }

  return currentOrder === "asc" ? (
    <ArrowUpNarrowWide className="!h-4 !w-4" />
  ) : (
    <ArrowDownNarrowWide className="!h-4 !w-4 rotate-180" />
  );
}
