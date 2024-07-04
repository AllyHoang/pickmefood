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

  const handleDoneTransaction = async (transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${transaction._id}/done`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Transaction accepted:", data);
      toast.success("Congratulation! Your transaction is completed");
    } catch (error) {
      console.error("Failed to finish transaction:", error);
      toast.error(error);
    }
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
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-heading3-bold line-clamp-1">
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transactions?.map((transaction) => {
                const matchingItems =
                  getMatchingItemsInOneTransaction(transaction);
                return (
                  <>
                    <Card
                      key={transaction._id}
                      className="flex flex-col bg-white rounded-lg shadow-lg pt-4 pl-8 relative"
                    >
                      {/* Status Badge */}
                      <Badge
                        variant={`${
                          transaction.status === "pending"
                            ? "primary"
                            : "secondary"
                        }`}
                        className={`px-3 py-1 rounded-full text-sm text-s absolute right-2 top-2 ${
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
                      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-2">
                        <div className="flex flex-col items-start mt-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={transaction?.donorId?.profileImage}
                                alt="Requester Image"
                              />
                              <AvatarFallback />
                            </Avatar>
                            <div>
                              <CardTitle className=" flex flex-col gap-1">
                                <p className="text-lg">
                                  {transaction?.donorId?.username}
                                </p>
                                <p className="text-[14px] text-gray-400">
                                  Donor
                                </p>
                              </CardTitle>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className=" font-semibold">
                              Donor: {transaction?.donorId?.firstName || "N/A"}
                            </p>
                          </div>

                          <div className="">
                            <hr className="my-2 border-t-2 border-gray-200 mr-2"></hr>
                            <p className="font-semibold  text-gray-600">
                              Basket Details:
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Title: </span>
                              {transaction?.basketId?.title || "No Title"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Location: </span>
                              {extractStateAndZip(
                                transaction?.basketId?.location
                              ) || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start mt-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={transaction?.requesterId?.profileImage}
                                alt="Requester Image"
                              />
                              <AvatarFallback />
                            </Avatar>
                            <div>
                              <CardTitle className=" flex flex-col gap-1">
                                <p className="text-lg">
                                  {transaction?.requesterId?.username}
                                </p>
                                <p className="text-[14px] text-gray-400">
                                  Requester
                                </p>
                              </CardTitle>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className=" font-semibold">
                              Requester:{" "}
                              {transaction?.requesterId?.firstName || "N/A"}
                            </p>
                          </div>

                          <div className="">
                            <hr className="my-2 border-t-2 border-gray-200 mr-2"></hr>
                            <p className="font-semibold  text-gray-600">
                              Request Details:
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Title: </span>
                              {transaction?.basketrequestId?.title ||
                                "No Title"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Location: </span>
                              {extractStateAndZip(
                                transaction?.basketrequestId?.location
                              ) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <CardFooter className="flex justify-between items-center mt-4">
                        {matchingItems.length > 0 ? (
                          <div className="flex justify-start align-start gap-2">
                            <p>Matches: </p>
                            <div className="flex gap-3 flex-wrap">
                              {matchingItems?.slice(0, 3).map((match) => (
                                <Badge
                                  key={match?.id}
                                  className="bg-sky-100 text-black"
                                >
                                  {match?.emoji} {match?.itemName}
                                </Badge>
                              ))}
                              {matchingItems?.length > 3 && (
                                <Badge className="bg-sky-100 text-black">
                                  +{matchingItems.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start align-middle gap-2">
                            <p>Matches:</p>
                            <p>None items match</p>
                          </div>
                        )}
                        <div className="flex gap-3 justify-between">
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
                        </div>
                      </CardFooter>
                    </Card>
                  </>
                );
              })}
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
