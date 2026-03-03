"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface RoomsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function RoomsPagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: RoomsPaginationProps) {
  if (totalPages <= 1) return null; // no need to show pagination if there's only 1 page

  const generatePages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      // render all pages if total pages are 5 or less for better UX
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // else use ellipsis for better UX
      pages.push(1);

      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1); // calculate start page, min will be 2
      const end = Math.min(
        totalPages - 1,
        currentPage + 1,
      ); /* calculate the end page
      (if many pages are present end will be just current page + 1) as we intend to show 3 middle page link*/
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <Pagination className="fixed bottom-10 place-self-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!hasPreviousPage}
            className={
              !hasPreviousPage
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              if (!hasPreviousPage) return;
              onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p} className="cursor-pointer">
              <PaginationLink
                isActive={p === currentPage}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!hasNextPage}
            className={
              !hasNextPage ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              if (!hasNextPage) return;
              onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
