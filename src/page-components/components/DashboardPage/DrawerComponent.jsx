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
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MdDescription } from "react-icons/md";

function DrawerComponent({ selectedBasket, id, handleOpenDialog }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  function extractStateAndZip(location) {
    if (typeof location !== "string") {
      return "";
    }

    const regex = /,\s*([A-Za-z\s]+)\s+(\d{5}),\s*United States$/;

    const match = location.match(regex);
    console.log(match);

    if (match) {
      const state = match[1].trim();
      const zip = match[2] ? match[2].trim() : "";
      return zip ? `${state}, ${zip}` : state;
    }
    return "";
  }

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
          router.push("/dashboard");
        }
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        {/* //item._id */}
        <Link
          href={{ pathname: "/dashboard", query: { id: id } }}
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
          <div className="flex gap-3">
            {selectedBasket?.type === "Donation"
              ? selectedBasket?.items.map((item) => (
                  <div>
                    <div key={item.id}>
                      <Badge className="bg-sky-100 text-black">
                        {item.emoji} {item.itemName}
                      </Badge>
                    </div>
                  </div>
                ))
              : selectedBasket?.requests.map((request) => (
                  // Your JSX for each request
                  <div key={request.id}>
                    <Badge className="bg-sky-100 text-black">
                      {request.emoji} {request.itemName}
                    </Badge>
                  </div>
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
              src={`${selectedBasket?.userId?.profileImage}`}
              alt="Donation Image"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div className="font-bold">
            {" "}
            Created by {selectedBasket?.userId.username}{" "}
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

        <div className="mt-4" onClick={() => handleOpenDialog(true)}>
          {selectedBasket?.type === "Request" ? (
            <button className="w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out fixed bottom-2">
              Donate
            </button>
          ) : (
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded transition duration-150 ease-in-out fixed bottom-2">
              Request
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;