import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import axios from "axios";
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
import { Badge } from "@/components/ui/badge";


function Leaderboard() {
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const rankTiers = [
    { name: "Bronze", minPoints: 0, maxPoints: 100 },
    { name: "Silver", minPoints: 101, maxPoints: 500 },
    { name: "Gold", minPoints: 501, maxPoints: 1000 },
    { name: "Platinum", minPoints: 1001, maxPoints: Infinity }, // Infinity for the highest tier
  ];

  // Function to determine rank based on points
  const getRank = (points) => {
    const tier = rankTiers.find(
      (tier) => points >= tier.minPoints && points <= tier.maxPoints
    );
    return tier ? tier.name : "Unknown";
  };

  // Function to fetch baskets data for a user
  const fetchBasketsData = async (userId) => {
    try {
      const response = await axios.get(`/api/baskets/${userId}`);
      return response.data.baskets || []; // Return baskets data or an empty array
    } catch (error) {
      console.error(`Error fetching baskets for user ${userId}:`, error);
      return []; // Return empty array if fetching fails
    }
  };

  // Function to fetch transactions data for a user
  const fetchTransactionsData = async (userId) => {
    try {
      const response = await axios.get(`/api/transactions/users/${userId}`);
      console.log(response.data.transactions);
      return response.data.transactions || []; // Return transactions data or an empty array
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      return []; // Return empty array if fetching fails
    }
  };

  const getRankColorClass = (rank) => {
    switch (rank) {
      case "Platinum":
        return "bg-blue-300"; // Adjust the color as needed
      case "Gold":
        return "bg-yellow-300"; // Adjust the color as needed
      case "Silver":
        return "bg-gray-300"; // Adjust the color as needed
      case "Bronze":
        return "bg-orange-300"; // Adjust the color as needed
      default:
        return "bg-gray-300"; // Default color for unknown ranks
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get("/api/users");
        const users = response.data.allUsers;

        const promises = users.map(async (user) => {
          // Fetch baskets and transactions concurrently
          const [baskets, transactions] = await Promise.all([
            fetchBasketsData(user._id),
            fetchTransactionsData(user._id),
          ]);

          // Update user object with donation and transaction counts
          const donation = baskets.length;
          const transaction = transactions.length;

          return {
            ...user,
            donation,
            transaction,
            points: user.points, // Assuming 'points' is already available in user data
          };
        });

        // Wait for all promises to resolve
        const updatedUsers = await Promise.all(promises);

        // Sort users based on descending points
        updatedUsers.sort((a, b) => b.points - a.points);

        // Update place and rank based on points
        updatedUsers.forEach((user, index) => {
          user.place = index + 1; // Place in the leaderboard
          user.rank = getRank(user.points); // Rank based on points
        });

        setData(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle specific error codes or messages here
        // Example: Show a notification or retry mechanism
      }
    };

    fetchUsersData();
  }, []);

  const columns = [
    {
      accessorKey: "place",
      header: () => <div className="text-center">Place</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="h-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
    {
      accessorKey: "points",
      header: () => <div className="text-center">Point</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    },
    {
      accessorKey: "rank",
      header: () => <div className="text-center">Rank</div>,
      cell: ({ getValue }) => <Badge className={` text-white ${getRankColorClass(getValue())} text-small-medium`}>
      {getValue()}
    </Badge>,
    },
  ];

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
    <div className=" mt-10 w-full  ">
      <h1 className="text-heading1-bold"> Leaderboard</h1>

      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-10">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-heading3-bold line-clamp-1">
            Top Donors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopDonors />
        </CardContent>
      </div>

      <div className="max-w-screen-2xl mx-auto w-full pb-4">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-heading3-bold line-clamp-1">
            All Users
          </CardTitle>
          <Button className="bg-sky-400" size="sm">
            Point's System
          </Button>
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
                    <TableRow key={row.id} className={`${
                      row.original._id === currentUser.id ? "bg-gray-100" : "bg-white"
                    } divide-y divide-gray-200`}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`px-6 py-4 whitespace-nowrap `}
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
      </div>
    </div>
  );
}

export default Leaderboard;
