import { useEffect, useRef, useState } from "react";
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
import Link from "next/link";
import DialogComponent from "../DashboardPage/DialogComponent";
import getMatchingItems, {
  extractStateAndZip,
  getMatchingItemsInOneTransaction,
  Status,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import DrawerTransaction from "./DrawerTransction";
import { Separator } from "@/components/ui/separator";
import { BiMap } from "react-icons/bi";
import SubCard from "./SubCard";

import { Button } from "@/components/ui/button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";

function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const router = useRouter();
  const { transactions, isLoading } = useFetchTransaction(currentUser.id);
  const acceptedTransactions = transactions.filter(
    (transaction) => transaction.status === Status.ACCEPTED
  );
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === Status.PENDING
  );
  const matchedTransactions = transactions.filter(
    (transaction) => transaction.status === Status.CONNECTED
  );
  const canceledTransactions = transactions.filter(
    (transaction) => transaction.status === Status.CANCELED
  );
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
  console.log("canceledTransactions: ", canceledTransactions);
  console.log("acceptedTransactions: ", acceptedTransactions);
  console.log("pendingTransactions: ", pendingTransactions);
  console.log("matchedTransactions: ", matchedTransactions);

  return (
    <div className="base-container">
    <div className="w-full">
      <h1 className="text-heading1-bold mt-4">Transaction</h1>
      <TransactionSummary
        canceledTransactions={canceledTransactions}
        acceptedTransactions={acceptedTransactions}
        pendingTransactions={pendingTransactions}
        matchedTransactions={matchedTransactions}
      />
      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {transactions?.map((transaction) => {
            const matchingItems = getMatchingItemsInOneTransaction(transaction);
            return (
              <Card
                key={transaction._id}
                className="flex flex-col bg-white rounded-lg shadow-lg p-3  gap-3"
              >
                <div className="flex justify-between">
                  <Badge
                    variant={`${
                      transaction.status === "pending" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-sm text-base-bold w-fit ${
                      transaction.status === "pending"
                        ? "bg-sky-200"
                        : transaction.status === "accepted"
                        ? "bg-emerald-200"
                        : transaction.status === "canceled"
                        ? "bg-red-200"
                        : "bg-orange-200"
                    }`}
                  >
                    {transaction.status === "pending"
                      ? "Pending"
                      : transaction.status === "accepted"
                      ? "Accepted"
                      : transaction.status === "canceled"
                      ? "Rejected"
                      : "Matched"}
                  </Badge>
                </div>

                <div className="flex gap-4">
                  <SubCard
                    user={transaction?.donorId}
                    type="Donation"
                    basket={transaction?.basketId}
                  ></SubCard>
                  <Separator orientation="vertical" />
                  <SubCard
                    user={transaction?.requesterId}
                    type="Request"
                    basket={transaction?.basketrequestId}
                  ></SubCard>
                </div>

                <Separator></Separator>

                {/* {transaction.status !== "accepted" && ( */}
                <DrawerTransaction
                  id={transaction._id}
                  handleOpenDialog={setOpenDialog}
                  selectedTransaction={selectedTransaction}
                  className="self-center"
                />
                {/* )} */}
              </Card>
            );
          })}
        </div>

        {/* <div className="flex gap-3 justify-between">
                          {transaction.status !== "canceled" && (
                            <button
                              onClick={() => {
                                handleDoneTransaction(transaction);
                              }}
                              className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-400 text-white p-2 rounded transition duration-150 ease-in-out"
                            >
                              <IoMdCheckmarkCircleOutline
                                size={20}
                              ></IoMdCheckmarkCircleOutline>
                              Done
                            </button>
                          )}

                          {transaction.status !== "accepted" &&
                            transaction.status !== "canceled" && (
                              <DrawerTransaction
                                id={transaction._id}
                                handleOpenDialog={setOpenDialog}
                                selectedTransaction={selectedTransaction}
                              />
                            )}
                        </div> */}
      </div>
    </div>
    </div>
  );
}

export default TransactionPage;
