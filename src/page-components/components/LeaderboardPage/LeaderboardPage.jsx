"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import TopDonors from "./TopDonors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Leaderboard() {
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  // Sample data for the table
  useEffect(() => {
    console.log(currentUser);
    if (currentUser) {
      const updatedData = [
        {
          id: "1",
          username: (
            <div className="flex items-center gap-2">
              <img
                src={`${currentUser.profileImage}`}
                alt="Donation Image"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Phan Anh Nguyen
                </span>
                {/* <span className="block text-sm text-gray-500">
                  @{`${currentUser.username}`}
                </span> */}
              </div>
            </div>
          ),
          donation: 316,
          rank: 1,
          transaction: 192,
          point: "💎 18,000",
          place:1,
        },
        {
          id: "2",
          username: (
            <div className="flex items-center gap-2">
              <img
                src={`${currentUser.profileImage}`}
                alt="Donation Image"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Phan Anh Nguyen
                </span>
                {/* <span className="block text-sm text-gray-500">
                  @{`${currentUser.username}`}
                </span> */}
              </div>
            </div>
          ),
          donation: 316,
          rank: 2,
          transaction: 192,
          point: "💎 18,000",
          place: 2,
        },
        {
          id: "3",
          username: "Jane Smith",
          transaction: 242,
          point: "💎 18000",
          rank: 3,
          donation: 400,
          place:3,
        },
        {
          id: "4",
          username: "Jane Smith",
          transaction: 242,
          point: "💎 18000",
          rank: 4,
          donation: 400,
          place: 4,
        },
        {
          id: "5",
          username: "Jane Smith",
          transaction: 242,
          point: "💎 18000",
          rank: 5,
          donation: 400,
          place:5,
        },
        {
          id: "6",
          username: "Jane Smith",
          transaction: 242,
          point: 18000,
          rank: 6,
          donation: 400,

        },
      ];
      setData(updatedData);
    }
  }, [currentUser]);
  // Column definitions
  const columns = [
    {
      accessorKey: "place",
      header: () => <div className="text-center">Place</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="h-10"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => <div className="">{getValue()}</div>,
    },
    {
      accessorKey: "donation",
      header: () => <div className="text-center">Donation</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      accessorKey: "transaction",
      header: () => <div className="text-center">Transaction</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    // {
    //   accessorKey: "amount",
    //   header: () => <div className="">Amount</div>,
    //   cell: ({ getValue }) => {
    //     const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(getValue());
    //     return <div className=" font-medium">{formatted}</div>;
    //   },
    // },
    {
      accessorKey: "point",
      header: () => <div className="text-center">Point</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      accessorKey: "rank",
      header: () => <div className="text-center">Rank</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Initialize the table instance with useReaxctTable
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-heading1-bold"> Leaderboard</h1>

      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-10">
        <Card className="border-none drop-shadow-sm ">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-heading3-bold line-clamp-1">
              Top Donors
            </CardTitle>
            {/* <Button className="bg-sky-400" size="sm">Point's System</Button> */}
          </CardHeader>
          <CardContent>
            <TopDonors></TopDonors>
          </CardContent>
        </Card>
      </div>
      {/* Donor Table */}
      <div className="max-w-screen-2xl mx-auto w-full pb-4">
        <Card className="border-none drop-shadow-sm ">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-heading3-bold line-clamp-1">
              All Users
            </CardTitle>
            <Button className="bg-sky-400" size="sm">Point's System</Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-sky-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="px-6 py-3 text-left text-xs text-heading5-bold tracking-wider align-middle"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap "
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Leaderboard;
