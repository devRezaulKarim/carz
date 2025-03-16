"use client";

import { cn } from "@/lib/utils";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface PaginationProps {
  baseURL: string;
  totalPages: number;
  maxVisiblePages?: number;
  styles: {
    paginationRoot: string;
    paginationLinkActive: string;
    paginationLink: string;
    paginationNext: string;
    paginationPrevious: string;
  };
}

export const CustomPagination = ({
  baseURL,
  totalPages,
  maxVisiblePages = 5,
  styles,
}: PaginationProps) => {
  const [currentPage, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    },
    serialize: (value) => value.toString(),
    shallow: false,
  });

  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: Math.min(totalPages, maxVisiblePages),
  });

  useEffect(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const newStart = Math.max(
      1,
      Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1),
    );
    const newEnd = Math.min(totalPages, newStart + maxVisiblePages - 1);
    setVisibleRange({ start: newStart, end: newEnd });
  }, [currentPage, totalPages, maxVisiblePages]);

  const createPageURL = (pageNumber: number) => {
    const url = new URL(baseURL, process.env.NEXT_PUBLIC_APP_URL);
    url.searchParams.set("page", pageNumber.toString());
    return url.toString();
  };

  const handleEllipsisClick = (direction: "left" | "right") => {
    const newPage =
      direction === "left"
        ? Math.max(1, visibleRange.start - maxVisiblePages)
        : Math.min(totalPages, visibleRange.end + maxVisiblePages);

    setPage(newPage);
  };

  return (
    <PaginationRoot className={styles.paginationRoot}>
      <PaginationContent className="justify-end lg:gap-4">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage <= 1 && "hidden",
              styles.paginationPrevious,
            )}
            href={createPageURL(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setPage(currentPage - 1);
            }}
          />
        </PaginationItem>
        {visibleRange.start > 1 && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEllipsisClick("left");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}
        {
          // pages goes here
        }
        {Array.from(
          { length: visibleRange.end - visibleRange.start + 1 },
          (_, i) => i + visibleRange.start,
        ).map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          let rel = "";
          if (pageNumber === currentPage - 1) rel = "prev";
          if (pageNumber === currentPage + 1) rel = "next";

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={isActive}
                {...(rel && { rel })}
                className={cn(
                  styles.paginationLink,
                  isActive && styles.paginationLinkActive,
                )}
                href={createPageURL(pageNumber)}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {visibleRange.end < totalPages && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEllipsisClick("right");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages && "hidden",
              styles.paginationNext,
            )}
            href={createPageURL(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};
