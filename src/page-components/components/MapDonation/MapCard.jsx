import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import DrawerComponent from "../DashboardPage/DrawerComponent";
import Link from "next/link";
import { extractStateAndZip } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

function MapCard({ basket, setOpenDialog, selectedBasket }) {
  return (
    <Card
      key={basket?._id}
      className="flex flex-col w-[300px] bg-white rounded-2xl shadow-lg justify-between p-2 h-[410px] -mt-1 "
      style={{ transform: "scale(0.93)" }} // Adjust the scale factor as needed
    >
      <CardTitle className="text-heading3-bold line-clamp-1  ">
        {basket?.title}
      </CardTitle>
      <img
        className="rounded-3xl w-full object-cover h-36 relative bottom-2 mt-1 "
        src={basket?.image}
      ></img>
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage
            src={`${basket?.userId?.profileImage}`}
            alt="Donation Image"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-bold">
            {basket?.userId?.firstName} {basket?.userId?.lastName}
          </p>

          <CardDescription className="underline">
            <Link
              href={{
                pathname: `/${basket?.userId?.username}`,
              }}
            >
              {" "}
              {basket?.userId?.username}
            </Link>
          </CardDescription>
        </div>
      </div>
      <p className=" line-clamp-1 text-body-light ">
        {basket.type === "Donation" ? basket?.description : basket?.reason}{" "}
      </p>
      <div className="flex justify-between">
        <div className="flex gap-3 flex-wrap">
          {basket?.type === "Donation"
            ? basket?.items?.slice(0, 1).map((item) => (
                <Badge
                  key={item?.id}
                  className="bg-sky-100 text-black text-small-medium"
                >
                  {item?.emoji} {item?.itemName}
                </Badge>
              ))
            : basket?.requests?.slice(0, 1).map((request) => (
                <Badge
                  key={request?.id}
                  className="bg-sky-100 text-black text-small-medium"
                >
                  {request?.emoji} {request?.itemName}
                </Badge>
              ))}

          {basket?.type === "Donation" && basket?.items?.length > 3 && (
            <Badge className="bg-sky-100 text-black text-small-medium">
              +{basket?.items.length - 1} more
            </Badge>
          )}
          {basket?.type !== "Donation" && basket?.requests?.length > 3 && (
            <Badge className="bg-sky-100 text-black text-small-medium">
              +{basket?.requests.length - 1} more
            </Badge>
          )}
        </div>
      </div>{" "}
      <div className="flex items-center gap-1 align-center relative">
        <BiMap></BiMap>
        <p className="font-medium text-sm">
          {basket?.location
            ? extractStateAndZip(basket.location)
            : "No Location"}
        </p>
      </div>
      <Separator></Separator>
      {basket.status === "initiated" || basket?.status == undefined ? (
        <DrawerComponent
          id={basket._id}
          handleOpenDialog={setOpenDialog}
          selectedBasket={selectedBasket}
          onPage="map"
        />
      ) : basket.status === "accepted" ? (
        <Button className="bg-green-500">Accepted</Button>
      ) : basket.status === "canceled" ? (
        <Button className="self-center bg-red-500 ">Canceled</Button>
      ) : (
        <Link
          className="self-center w-full"
          href={{ pathname: "/chats" }}
          shallow={true}
        >
          <Button className="bg-sky-500 w-full">Let's chat</Button>
        </Link>
      )}
    </Card>
  );
}
export default MapCard;
