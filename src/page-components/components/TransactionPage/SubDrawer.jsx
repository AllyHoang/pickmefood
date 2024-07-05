import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import getMatchingItems, {
  extractStateAndZip,
  getMatchingItemsInOneTransaction,
} from "@/lib/utils";

function SubDrawer({ user, basket, type }) {
  //define a string constant user depends on the value of "type"
  const userType = type === "Donation" ? "donor" : "requester";
  const badge = type === "Donation" ? "Donation 🚀" : "Request 🤲";
  const basketContent = type === "Donation" ? basket?.items : basket?.requests;

  const calculateDaysDifference = (date) => {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const timeDifference = currentDate - givenDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
  };

  return (
    <div className="flex flex-col gap-1">
      {basket?.image && (
        <div className="overflow-hidden rounded-t-lg">
          <img
            src={`${basket?.image}`}
            alt="Donation"
            className="w-full h-full object-cover hover:scale-105 transition-scale duration-300"
            style={{ height: "200px" }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex gap-2">
          <Avatar className="scale-75">
            <AvatarImage src={`${user?.profileImage}`} alt="Donation Image" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>

        <div>
          <h2 className="text-heading4-bold font-bold mt-1">{basket?.title}</h2>
        </div>
      </div>

      <div className="">
        <p className="font-light">
          {basket?.type === "Donation" ? basket?.description : basket?.reason}{" "}
        </p>
      </div>

      <div className="flex items-center gap-1 align-center relative">
        <BiMap></BiMap>
        <p className="font-medium text-sm">{basket?.location}</p>
      </div>

      <div>
        <p className="flex items-center  font-bold">
          {/* <RxSewingPin className="mr-2" size="20px" />  */}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {basket?.type === "Donation"
            ? basket?.items.map((item) => (
                <Badge
                  key={item.id}
                  className="bg-sky-100 text-black flex items-center gap-1 font-medium"
                >
                  <span>{item?.emoji}</span>
                  <span>{item?.itemName}</span>
                </Badge>
              ))
            : basket?.requests.map((request) => (
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
    </div>
  );
}
export default SubDrawer;
