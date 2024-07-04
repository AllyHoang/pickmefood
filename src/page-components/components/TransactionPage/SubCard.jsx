import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import getMatchingItems, {
  extractStateAndZip,
  getMatchingItemsInOneTransaction,
} from "@/lib/utils";

function SubCard({ user, basket, type }) {
  //define a string constant user depends on the value of "type"
  const userType = type === "Donation" ? "donor" : "requester";
  const badge = type === "Donation" ? "Donation 🚀" : "Request 🤲";
  const basketContent = type === "Donation" ? basket?.items : basket?.requests;

  return (
    <div className="flex flex-col w-1/2 gap-3 p-2">
      <div className="flex items-center gap-2 -p-10 ">
        <Avatar>
          <AvatarImage src={user.profileImage} alt={`${userType} image`} />
          <AvatarFallback />
        </Avatar>
        <div>
          <div className=" flex flex-col gap-1 ">
            <p className="text-lg font-medium">{user.username}</p>
            <Badge
              variant="primary"
              className={`px-3 py-1 rounded-full text-small-medium w-fit ${
                type === "Request" ? "bg-sky-100" : "bg-emerald-100"
              }`}
            >
              {badge}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-heading3-bold line-clamp-1">
        {basket.title || "No Title"}
      </p>
      <img
        className="rounded-3xl w-full object-cover h-40"
        src={basket.image}
      ></img>

      {/* <div className="flex gap-3 flex-wrap">
        {basketContent?.slice(0, 2).map((item) => (
          //   <Badge
          //     key={item?.id}
          //     className="bg-sky-100 text-black text-small-medium"
          //   >
          //     {item?.emoji} {item?.itemName}
          //   </Badge>
          <p key={item?.id}>
            {item?.itemName}
          </p>
        ))}
      </div> */}
      <div className="flex items-center gap-1 align-center relative">
        <BiMap></BiMap>
        <p className="font-medium text-sm">
          {extractStateAndZip(basket.location) || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default SubCard;
