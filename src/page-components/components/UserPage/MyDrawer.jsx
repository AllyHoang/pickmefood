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
  userData
}) {
  const [open, setOpen] = useState(false);
  const username = userData?.username;
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
          router.push(`/profile/${username}`);
        }
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        {/* //item._id */}
        <Link
          href={{
            pathname: `/profile/${username}`,
            query: { id: id },
          }}
          shallow={true}
          className="self-center"
        >
          View Details
        </Link>
      </DrawerTrigger>

      <DrawerContent className="bg-white flex flex-col justify-start gap-4 rounded-t-lg shadow-xl transition-all duration-300 h-full w-[600px] fixed bottom-0 right-0 p-3 mt-5 tracking-wide">
        {selectedBasket?.image && (
          <div className="overflow-hidden rounded-t-lg">
            <img
              src={`${selectedBasket?.image}`}
              alt="Donation"
              className="w-full h-full object-cover hover:scale-105 transition-scale duration-300"
              style={{ height: "300px" }}
            />
          </div>
        )}
        <div>
          <h2 className="text-heading2-bold font-bold">
            {selectedBasket?.title}
          </h2>
          <p className="text-neutral-500">
            {selectedBasket?.type === "Donation"
              ? "Donation posted"
              : "Request posted"}{" "}
            {selectedBasket?.type === "Donation"
              ? calculateDaysDifference(selectedBasket?.items[0].createdAt)
              : calculateDaysDifference(
                  selectedBasket?.requests[0].createdAt
                )}{" "}
            days ago at {extractStateAndZip(selectedBasket?.location)}
          </p>
        </div>

        <div className="flex justify-between ">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={`${userData?.profileImage}`}
                alt="Donation Image"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>

            <div className="font-bold"> {userData?.username} </div>
          </div>

          {/* <p className="self-center text-[20px] leading-3 font-medium tracking-wide mt-4 mb-2">
          ITEM INFORMATION
        </p> */}
        </div>

        <div className="">
          <div className="text-heading4-bold ">Description</div>
          <p className="font-light">
            {selectedBasket?.type === "Donation"
              ? selectedBasket?.description
              : selectedBasket?.reason}{" "}
          </p>
        </div>

        <div>
          <p className="flex items-center  font-bold">
            {/* <RxSewingPin className="mr-2" size="20px" />  */}
            <span className="text-heading4-bold">Location</span>
          </p>
          <span className="font-light">{selectedBasket?.location}</span>
        </div>

        <div>
          <p className="flex items-center  font-bold">
            {/* <RxSewingPin className="mr-2" size="20px" />  */}
            <span className="text-heading4-bold">Items</span>
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedBasket?.type === "Donation"
              ? selectedBasket?.items.map((item) => (
                  <Badge
                    key={item.id}
                    className="bg-sky-100 text-black flex items-center gap-1 font-medium"
                  >
                    <span>{item?.emoji}</span>
                    <span>{item?.itemName}</span>
                  </Badge>
                ))
              : selectedBasket?.requests.map((request) => (
                  <Badge
                    key={request.id}
                    className="bg-sky-100 text-black flex items-center gap-1 font-medium"
                    c
                  >
                    <span>{request?.emoji}</span>
                    <span>{request?.itemName}</span>
                  </Badge>
                ))}
          </div>
        </div>

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
