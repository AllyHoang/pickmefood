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
import Link from "next/link";
import MyDrawer from "./MyDrawer";
import useUser from "@/hook/useUser";
import { extractStateAndZip } from "@/lib/utils";

function MyCard({ basket, setOpenDialog, selectedBasket, loggedInUserId, userId, type }) {
  const truncateDescription = (description, maxWords) => {
    const words = description?.split(" ");
    if (words?.length > maxWords) {
      return words?.slice(0, maxWords)?.join(" ") + "...";
    }
    return description;
  };
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
                  src={useUser(basket?.userId).user.profileImage}
                  alt="Donation Image"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-heading3-bold">
                  {basket?.title}
                </CardTitle>
                <CardDescription>
                  {useUser(basket?.userId).user.username}
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
        <div className="flex gap-3 flex-wrap">
          {basket?.type === "Donation"
            ? basket?.items?.slice(0, 2).map((item) => (
                <Badge key={item?.id} className="bg-sky-100 text-black">
                  {item?.emoji} {item?.itemName}
                </Badge>
              ))
            : basket?.requests?.slice(0, 2).map((request) => (
                <Badge key={request?.id} className="bg-sky-100 text-black">
                  {request?.emoji} {request?.itemName}
                </Badge>
              ))}
          {basket?.type === "Donation" && basket?.items?.length > 3 && (
            <Badge className="bg-sky-100 text-black">
              +{basket?.items.length - 2} more
            </Badge>
          )}
          {basket?.type !== "Donation" && basket?.requests?.length > 3 && (
            <Badge className="bg-sky-100 text-black">
              +{basket?.requests.length - 3} more
            </Badge>
          )}
        </div>

        {basket.status === "initiated" || basket?.status == undefined ? (
          <MyDrawer
            id={basket._id}
            handleOpenDialog={setOpenDialog}
            selectedBasket={selectedBasket}
            type={type}
            userId = {userId}
            loggedInUserId = {loggedInUserId}
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
export default MyCard;
