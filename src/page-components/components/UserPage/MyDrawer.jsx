import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RxClock } from "react-icons/rx";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { RxSewingPin } from "react-icons/rx";
import { RxPerson } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hook/useUser";
import RemoveBtn from "./RemoveButton";
import RemoveRequestsBtn from "./RemoveRequestsButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditBasketForm from "./EditBasketForm";
import { extractStateAndZip } from "@/lib/utils";

function MyDrawer({
  selectedBasket,
  id,
  handleOpenDialog,
  loggedInUserId,
  userId,
  type,
}) {
  const [open, setOpen] = useState(false);
  const username = useUser(userId).user.username;
  const router = useRouter();


  const calculateDaysDifference = (date) => {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const timeDifference = currentDate - givenDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
  };

  return (
    <Drawer
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          router.push(`/${username}`);
        }
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        {/* //item._id */}
        <Link
          href={{
            pathname: `/${username}`,
            query: { id: id },
          }}
          shallow={true}
        >
          <Button className="">View Details</Button>
        </Link>
      </DrawerTrigger>

      <DrawerContent className="bg-white flex flex-col justify-start gap-4 rounded-t-lg shadow-xl transition-all duration-300 h-full w-[500px] fixed bottom-0 right-0 p-3">
        {selectedBasket?.image && (
          <div className="overflow-hidden rounded-t-lg">
            <img
              src={`${selectedBasket?.image}`}
              alt="Donation"
              className="w-full object-cover hover:scale-105 transition-scale duration-300"
              style={{ height: "200px" }}
            />
          </div>
        )}

        <div className="flex flex-col ">
          <h2 className="text-heading2-bold font-bold">
            {selectedBasket?.title}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedBasket?.type === "Donation"
              ? selectedBasket?.items.map((item) => (
                  <Badge key={item.id} className="bg-sky-100 text-black flex items-center gap-1">
                    <span>{item.emoji}</span>
                    <span>{item.itemName}</span>
                  </Badge>
                ))
              : selectedBasket?.requests.map((request) => (
                  <Badge key={request.id} className="bg-sky-100 text-black flex items-center gap-1">
                    <span>{request.emoji}</span>
                    <span>{request.itemName}</span>
                  </Badge>
                ))}
          </div>
        </div>

        <p className="text-gray-500">
          Created{" "}
          {selectedBasket?.type === "Donation"
            ? calculateDaysDifference(selectedBasket?.items[0].createdAt)
            : calculateDaysDifference(
                selectedBasket?.requests[0].createdAt
              )}{" "}
          days ago at {extractStateAndZip(selectedBasket?.location)}
        </p>

        <div className="flex gap-2">
          <Avatar>
            <AvatarImage
              src={useUser(selectedBasket?.userId).user.profileImage}
              alt="Donation Image"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div className="font-bold">
            {" "}
            Created by {useUser(selectedBasket?.userId).user.username}{" "}
          </div>
        </div>

        <Separator className="h-[1px] w-full mt-2"></Separator>
        <div>
          <div className="flex">
            {/* <MdDescription className="mr-2" size="20px" /> */}
            <div className="font-bold italic">Description</div>
          </div>
          <p className="">
            {selectedBasket?.type === "Donation"
              ? selectedBasket?.description
              : selectedBasket?.reason}
          </p>
        </div>
        <div>
          <p className="flex items-center text-gray-800 font-bold">
            {/* <RxSewingPin className="mr-2" size="20px" /> */}
            <span className="font-bold italic">Location</span>
          </p>
          <span className="">{selectedBasket?.location}</span>
        </div>
        {selectedBasket?.expiryDate && (
          <div className="flex justify-between align-middle ">
            <p className="flex items-center text-gray-800 font-bold">
              {/* <RxClock className="mr-2" size="20px" /> */}
              Expires:
            </p>
            <span>{selectedBasket?.expiryDate}</span>
          </div>
        )}

        {userId === loggedInUserId ? (
          <div className="mt-4 flex-col" onClick={() => handleOpenDialog(true)}>
            <Dialog>
              <DialogTrigger>
                <Button className="w-10/12 self fixed bottom-12 left-10 bg-sky-400">
                  {" "}
                  Edit{" "}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <EditBasketForm basket={selectedBasket} userId={userId} />
              </DialogContent>
            </Dialog>

            {type === "Donation" ? (
              <RemoveBtn id={selectedBasket?._id} userId={userId} />
            ) : (
              <RemoveRequestsBtn id={selectedBasket?._id} userId={userId} />
            )}
          </div>
        ) : (
          <></>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default MyDrawer;
