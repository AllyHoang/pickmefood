import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function PagingSection({
  totalBaskets,
  basketsPerPage,
  currentPage,
  setCurrentPage,
}) {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalBaskets / basketsPerPage); i++) {
    pages.push(i);
  }
  // Navigate to the previous page if not on the first page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to the next page if not on the last page
  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink onClick={() => handlePrevPage()}></PaginationLink>
        </PaginationItem>
        {pages.map((page, idx) => (
          <PaginationItem
            key={idx}
            className={currentPage === page ? " rounded-md" : ""}
          >
            <PaginationLink
              onClick={() => setCurrentPage(page)}
            ></PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink onClick={() => handleNextPage()}></PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PagingSection;
