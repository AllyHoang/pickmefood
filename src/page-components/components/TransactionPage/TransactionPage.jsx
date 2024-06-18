import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoSearch } from "react-icons/go";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import { useRouter } from "next/router";
import useFetchAllBaskets from "@/hook/useFetchAllBaskets";
import { Status } from "@/lib/utils";
import Link from "next/link";
import DialogComponent from "../DashboardPage/DialogComponent";
import DrawerComponent from "../DashboardPage/DrawerComponent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TransactionSummary from "./TransactionSummary";

function TransactionPage() {
    const [selectedBasket, setSelectedBasket] = useState(null);
    const router = useRouter();
    const { baskets, isLoading } = useFetchAllBaskets();
    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseModal = () => {
        setOpenDialog(false);
      };
    
      const truncateDescription = (description, maxWords) => {
        const words = description?.split(" ");
        if (words?.length > maxWords) {
          return words?.slice(0, maxWords)?.join(" ") + "...";
        }
        return description;
      };
    
      useEffect(() => {
        if (router.query.id) {
          const basket = baskets.find((basket) => basket._id === router.query.id);
          setSelectedBasket(basket);
        }
      }, [router.query.id, baskets]);
    
  return (
    <div className="w-full">
      <h1 className="text-heading1-bold"> Transaction</h1>
      {/* Transaction Summary */}
        <TransactionSummary></TransactionSummary>
        {/* All Transctions */}
      <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-2">
        <Card className="border-none drop-shadow-sm ">
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
          <div className="grid grid-cols-2 gap-8">
            {baskets?.map((basket) => (
              <Card
                key={basket._id}
                className="flex flex-col bg-white rounded-lg shadow-lg"
              >
                <CardHeader className="flex-col gap-4 items-start">
                  <Badge
                    variant={`${
                      basket.type === "Request" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-full text-sm font-large text-s ${
                      basket.type === "Request"
                        ? "bg-sky-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    {basket.type === "Request"
                      ? `${basket.type} 🤲`
                      : `${basket.type} 🚀`}
                  </Badge>

                  <div className="flex flex-row gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={`${basket?.userId?.profileImage}`}
                        alt="Donation Image"
                      />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{basket?.title}</CardTitle>
                      <CardDescription>
                        {basket.type === "Donation"
                          ? basket?.description?.slice(0, 2)
                          : basket?.reason?.slice(0, 2)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    {truncateDescription(
                      basket.type === "Donation"
                        ? basket?.description
                        : basket?.reason,
                      15
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-1 align-center">
                    <BiMap></BiMap>
                    <p className="font-medium text-sm"> {basket?.location} </p>
                  </div>

                  {/* <p className="font-medium text-sm">
                    {" "}
                    {basket.type === "Donation"
                      ? `○ Expires: ${basket?.expiryDate}`
                      : ``}{" "}
                  </p> */}
                  {basket.status === "initiated" ||
                  basket?.status == undefined ? (
                    <DrawerComponent
                      id={basket._id}
                      handleOpenDialog={setOpenDialog}
                      selectedBasket={selectedBasket}
                    />
                  ) : basket.status === "accepted" ? (
                    <Button className="bg-green-500">Accepted</Button>
                  ) : basket.status === "canceled" ? (
                    <Button className="bg-red-500">Canceled</Button>
                  ) : (
                    <Link href={{ pathname: "/notifications" }} shallow={true}>
                      <Button className="bg-sky-500">Let's chat</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TransactionPage;
