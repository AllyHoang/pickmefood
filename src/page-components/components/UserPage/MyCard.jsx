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
import { Separator } from "@/components/ui/separator";

function MyCard({
  basket,
  setOpenDialog,
  selectedBasket,
  loggedInUserId,
  userId,
  type,
  userData
}) {
  const truncateDescription = (description, maxWords) => {
    const words = description?.split(" ");
    if (words?.length > maxWords) {
      return words?.slice(0, maxWords)?.join(" ") + "...";
    }
    return description;
  };

  return (
    <Card
      key={basket?._id}
      className="flex flex-col bg-white rounded-2xl shadow-lg gap-4 p-4 h-full"
    >
      <div className="flex gap-3">
        <Badge
          variant={`${basket?.type === "Request" ? "primary" : "secondary"}`}
          className={`px-3 py-1 rounded-full text-small-bold font-md w-fit ${
            basket.type === "Request" ? "bg-sky-100" : "bg-emerald-100"
          }`}
        >
          {basket.type === "Request"
            ? `${basket.type} 🤲`
            : `${basket.type} 🚀`}
        </Badge>
        {basket?.matchPercentage ? (
          <Badge
            className={`px-3 py-1 rounded-full text-small-bold font-md w-fit bg-amber-200`}
          >
            {" "}
            {basket?.matchPercentage}% match{" "}
          </Badge>
        ) : (
          <></>
        )}
      </div>
      <CardTitle className="text-heading3-bold line-clamp-1">{basket?.title}</CardTitle>
      <img
        className="rounded-3xl w-full object-cover h-48"
        src={basket?.image}
      ></img>
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage
            src={userData?.profileImage}
            alt="Donation Image"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-bold">
            {userData?.firstName} {userData?.lastName}
          </p>
          <CardDescription className="underline">
            <Link
              href={{
                pathname: `/profile/${basket?.userId?.username}`,
              }}>
              {" "}
              {userData?.username}
            </Link>
          </CardDescription>
        </div>
      </div>
      <p className="h-11">
        {truncateDescription(
          basket?.type === "Donation" ? basket?.description : basket?.reason,
          15
        )}{" "}
      </p>
      <div className="flex justify-between">
        <div className="flex gap-3 flex-wrap line-clamp-1">
          {basket?.type === "Donation"
            ? basket?.items?.slice(0, 2).map((item) => (
                <Badge
                  key={item?.id}
                  className="bg-sky-100 text-black text-small-medium"
                >
                  {item?.emoji} {item?.itemName}
                </Badge>
              ))
            : basket?.requests?.slice(0, 2).map((request) => (
                <Badge
                  key={request?.id}
                  className="bg-sky-100 text-black text-small-medium"
                >
                  {request?.emoji} {request?.itemName}
                </Badge>
              ))}
          {basket?.type === "Donation" && basket?.items?.length > 3 && (
            <Badge className="bg-sky-100 text-black text-small-medium">
              +{basket?.items.length - 2} more
            </Badge>
          )}
          {basket?.type !== "Donation" && basket?.requests?.length > 3 && (
            <Badge className="bg-sky-100 text-black text-small-medium">
              +{basket?.requests.length - 3} more
            </Badge>
          )}
        </div>
      </div>{" "}
      <div className="flex items-center gap-1 align-center relative">
        <BiMap></BiMap>
        <p className="font-medium text-sm">
          {basket?.location
            ? extractStateAndZip(basket?.location)
            : "No Location"}
        </p>
      </div>
      <Separator></Separator>
      <MyDrawer
        id={basket._id}
        handleOpenDialog={setOpenDialog}
        selectedBasket={selectedBasket}
        type={type}
        userId={userId}
        userData={userData}
        loggedInUserId={loggedInUserId}
      />
    </Card>
  );
}
export default MyCard;
