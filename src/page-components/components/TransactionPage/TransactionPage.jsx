import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TransactionSummary from "./TransactionSummary";
import useFetchTransaction from "@/hook/useFetchTransaction";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import DrawerTransaction from "./DrawerTransction";

function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const router = useRouter();
  const { transactions, isLoading } = useFetchTransaction(currentUser.id);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(transactions);

  const handleOpenDialog = (basket) => {
    setSelectedBasket(basket);
    setOpenDialog(true);
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
    setSelectedBasket(null);
  };

  useEffect(() => {
    if (router.query.id) {
      const transaction = transactions.find(
        (transaction) => transaction._id === router.query.id
      );
      setSelectedTransaction(transaction);
    }
  }, [router.query.id, transactions]);

  return (
    <div className="w-full">
      <h1 className="text-heading1-bold">Transaction</h1>
      <TransactionSummary />
      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-2">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-heading3-bold line-clamp-1">
              All Transactions
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch id="analytic-mode" />
              <Label htmlFor="analytic-mode">Statistic Mode</Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transactions?.map((transaction) => (
                <Card
                  key={transaction._id}
                  className="flex flex-col bg-white rounded-lg shadow-lg pt-4 pl-8 relative"
                >
                  {/* Status Badge */}
                  <Badge
                    variant={`${
                      transaction.status === "pending" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-full text-sm text-s absolute right-2 top-2 ${
                      transaction.status === "pending"
                        ? "bg-sky-200"
                        : transaction.status === "accepted"
                        ? "bg-emerald-200"
                        : transaction.status === "canceled"
                        ? "bg-red-200"
                        : "Unknown Status"
                    }`}
                  >
                    {transaction.status === "pending"
                      ? "Pending"
                      : transaction.status === "accepted"
                      ? "Accepted"
                      : transaction.status === "canceled"
                      ? "Rejected"
                      : "Unknown Status"}
                  </Badge>
                  <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={transaction?.donorId?.profileImage}
                            alt="Donor Image"
                          />
                          <AvatarFallback />
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {transaction?.donorId?.username}
                          </CardTitle>
                          <CardDescription>
                            {transaction?.donorItem}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-semibold">Basket Details:</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Title: </span>
                          {transaction?.basketId?.title || "No Title"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Location: </span>
                          {transaction?.basketId?.location || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={transaction?.requesterId?.profileImage}
                            alt="Requester Image"
                          />
                          <AvatarFallback />
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {transaction?.requesterId?.username}
                          </CardTitle>
                          <CardDescription>
                            {transaction?.requestItem}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-semibold">Request Basket Details:</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Title: </span>
                          {transaction?.basketrequestId?.title || "No Title"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Location: </span>
                          {transaction?.basketrequestId?.location || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <p className="mt-2 text-sm text-gray-600">
                      {transaction?.description}
                    </p>
                    <div className="mt-4">
                      <h3 className="font-semibold">Matching Items:</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {transaction?.basketId?.items &&
                        transaction?.basketrequestId?.requests ? (
                          getMatchingItems(
                            transaction?.basketId?.items,
                            transaction?.basketrequestId?.requests
                          )?.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-2"
                            >
                              <span className="text-2xl">{item.emoji}</span>
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p>No items to display</p>
                        )}
                      </div> */}
                  {/* </div> */}
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span>{transaction?.location}</span>
                    </div>
                    {transaction.status !== "accepted" && (
                      <DrawerTransaction
                        id={transaction._id}
                        handleOpenDialog={setOpenDialog}
                        selectedBasket={selectedTransaction}
                      />
                    )}
                  </CardFooter>
                </Card>
              ))}
              {/* {selectedBasket && openDialog && (
                <DialogComponent
                  itemKey={JSON.stringify(selectedBasket)}
                  openDialog={openDialog}
                  handleCloseModal={handleCloseModal}
                  otherBasket={selectedBasket}
                />
              )} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TransactionPage;
