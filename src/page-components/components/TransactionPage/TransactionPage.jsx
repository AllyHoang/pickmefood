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
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import DrawerTransaction from "./DrawerTransction";
import { Separator } from "@/components/ui/separator";
import { BiMap } from "react-icons/bi";
import SubCard from "./SubCard";

import {
  NotificationFeedPopover,
  NotificationIconButton,
  NotificationCell,
} from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { Button } from "@/components/ui/button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";

function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const router = useRouter();
  const { transactions, isLoading } = useFetchTransaction(currentUser.id);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(transactions);
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

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
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={(e) => setIsVisible(!isVisible)}
      />
      <NotificationFeedPopover
        buttonRef={notifButtonRef}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        renderItem={({ item, ...props }) => (
          <NotificationCell {...props} item={item}>
            <div className="rounded-xl">
              <Link
                className="flex items-center space-x-4 p-2  rounded-md text-blue-500 transition duration-150 ease-in-out"
                onClick={() => {
                  setIsVisible(false);
                }}
                href={`/transactions`}
              >
                {/* User and Message Container */}
                <div className="flex flex-col">
                  <span className="font-bold">{item.data.name}</span>
                  <span className="text-gray-500 "> {item.data.message}</span>

                </div>
              </Link>
            </div>
          </NotificationCell>
        )}
      />

      <h1 className="text-heading1-bold">Transaction</h1>
      <TransactionSummary />
      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-4">
        <div className="text-heading3-bold line-clamp-1">All Transactions</div>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
        </CardContent>

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
  );
}

export default TransactionPage;
