import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import DrawerComponent from "./DrawerComponent";
import Link from "next/link";

function CardComponent({ basket, setOpenDialog, selectedBasket }) {
  const truncateDescription = (description, maxWords) => {
    const words = description?.split(" ");
    if (words?.length > maxWords) {
      return words?.slice(0, maxWords)?.join(" ") + "...";
    }
    return description;
  };

  function extractStateAndZip(location) {
    if (typeof location !== "string") {
      return "";
    }

    const regex = /,\s*([A-Za-z\s]+)\s+(\d{5}),\s*United States$/;

    const match = location.match(regex);

    if (match) {
      const state = match[1].trim();
      const zip = match[2] ? match[2].trim() : "";
      return zip ? `${state}, ${zip}` : state;
    }
    return "";
  }


  return (
    <Card
      key={basket._id}
      className="flex flex-col bg-white rounded-lg shadow-lg gap-5"
    >
      <div className="flex justify-between">
        <div>
          <CardHeader className="flex-col gap-4 items-start">
            <Badge
              variant={`${basket.type === "Request" ? "primary" : "secondary"}`}
              className={`px-3 py-1 rounded-full text-xs font-md ${
                basket.type === "Request" ? "bg-sky-100" : "bg-emerald-100"
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
                <CardTitle className="text-heading3-bold">
                  {basket?.title}
                </CardTitle>
                <CardDescription>
                  {basket.userId.username}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-between">
            <p className="italic">
              {truncateDescription(
                basket.type === "Donation"
                  ? basket?.description
                  : basket?.reason,
                15
              )}{" "}
            </p>
          </CardContent>
        </div>
        <img
          className="rounded-3xl size-48 mt-10 mr-10"
          src={basket?.image}
        ></img>
      </div>
      <div className="flex items-center gap-1 align-center relative left-7">
        <BiMap></BiMap>
        <p className="font-medium text-sm">
          {basket?.location
            ? extractStateAndZip(basket.location)
            : "No Location"}
        </p>
      </div>
      <CardFooter className="flex justify-between">
        <div className="flex gap-3">
          {basket?.type === "Donation"
            ? basket.items?.map((item) => (
                <div>
                  <div key={item.id}>
                    <Badge className="bg-sky-100 text-black">
                      {item.emoji} {item.itemName}
                    </Badge>
                  </div>
                </div>
              ))
            : basket.requests?.map((request) => (
                // Your JSX for each request
                <div key={request.id}>
                  <Badge className="bg-sky-100 text-black">
                    {request.emoji} {request.itemName}
                  </Badge>
                </div>
              ))}
        </div>

        {basket.status === "initiated" || basket?.status == undefined ? (
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
  );
}
export default CardComponent;
