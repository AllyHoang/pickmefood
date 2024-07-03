import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import DialogComponent from "./DialogComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const TopMatchComponent = ({
  matches,
  handleOpenPreferenceModal,
  setOpenDialog,
  selectedBasket,
  handleCloseModal,
  openDialog,
}) => {
  console.log(matches);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 3;
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  // Get current matches
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-heading2-bold line-clamp-1">
          Top Matches
        </CardTitle>
        <div className="flex justify-center align-middle gap-2">
          <Button className="bg-sky-400" size="sm">
            View Matches
          </Button>
          <Button className="" size="sm" onClick={handleOpenPreferenceModal}>
            Change Preference
          </Button>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="grid grid-cols-3 gap-4">
          {currentMatches.map((match) => (
            <CardComponent
              basket={match}
              setOpenDialog={setOpenDialog}
              selectedBasket={selectedBasket}
            ></CardComponent>
          ))}
          {/* Dialog UI */}
          {selectedBasket && openDialog && (
            <DialogComponent
              itemKey={JSON.stringify(selectedBasket)}
              openDialog={openDialog}
              handleCloseModal={handleCloseModal}
              otherBasket={selectedBasket}
            ></DialogComponent>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopMatchComponent;
