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
                {/* Status Badge */}
                <div className="flex justify-between">
                  {/* {matchingItems.length > 0 ? (
                    <div className="flex justify-start align-start gap-2">
                      <p className="font-bold">Matches: </p>
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
                    <div className="flex justify-start align-middle gap-2 font-bold">
                      <p>Matches:</p>
                      <p>None items match</p>
                    </div>
                  )} */}

                  <></>

                  <Badge
                    variant={`${
                      transaction.status === "pending" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-sm text-base-bold w-fit ${
                      transaction.status === "pending"
                        ? "bg-orange-200"
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
                </div>
                {/* <Separator></Separator> */}

                <div className="flex gap-4">
                  <SubCard
                    user={transaction?.donorId}
                    type="Donation"
                    basket={transaction?.basketId}
                  ></SubCard>
                  {/* <Separator orientation="vertical" /> */}
                  <SubCard
                    user={transaction?.requesterId}
                    type="Request"
                    basket={transaction?.basketrequestId}
                  ></SubCard>
                </div>

                <Separator></Separator>

                {transaction.status !== "accepted" && (
                  <DrawerTransaction
                    id={transaction._id}
                    handleOpenDialog={setOpenDialog}
                    selectedTransaction={selectedTransaction}
                    className="self-center"
                  />
                )}
              </Card>
            );
          })}
        </CardContent>
      </div>
    </div>
  );
}

export default TransactionPage;
