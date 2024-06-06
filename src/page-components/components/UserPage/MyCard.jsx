import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MyCard = ({ item }) => {
  return (
    <Card key={item.id} className="flex flex-col bg-white rounded-lg shadow-md">
      <CardHeader className="flex-col gap-4 items-start">
        <Badge
          variant={`${item.type === "Request" ? "primary" : "secondary"}`}
          className={`px-3 py-1 rounded-full text-sm font-large text-s ${
            item.type === "Request" ? "bg-sky-100" : "bg-emerald-100"
          }`}
        >
          {item.type === "Request" ? `${item.type} 🤲` : `${item.type} 🚀`}
        </Badge>

        <div className="flex flex-row gap-4 items-center">
          <div>
            <CardTitle className="text-xl">{item.itemName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {item.type === "Donation" ? `${item.description}` : `${item.reason}`}{" "}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="font-semibold"> ○ {item.location} </p>
        <p className="font-semibold">
          {item.type === "Donation" ? `○ Expires: ${item.expirationDate}` : ``}
        </p>

        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button>View Details</Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] mt-24 fixed bottom-0 right-0"></DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
};

export default MyCard;
