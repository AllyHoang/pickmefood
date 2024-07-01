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
import { RxClock } from "react-icons/rx";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { RxSewingPin } from "react-icons/rx";
import { RxPerson } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { extractStateAndZip } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CiChat2 } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";

function DrawerTransaction({ selectedTransaction, id, handleOpenDialog }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { loading, error, currentUser } = useSelector((state) => state.user);

  const handleAccept = async (selectedTransaction) => {
    try {
      let url;
      if (selectedTransaction.donorId._id === currentUser.id) {
        url = "agree-donor";
      } else {
        url = "agree-requester";
      }
      const response = await fetch(
        `/api/transactions/${selectedTransaction._id}/${url}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOpen(false);
      console.log("Transaction accepted:", data);
      toast.success("You have accepted this transcation. Please wait for others");
    } catch (error) {
      console.error("Failed to accept transaction:", error);
      toast.error(error);
    }
  };

  const handleCancel = async (selectedTransaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${selectedTransaction._id}/canceled`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Transaction canceled:", data);
      setOpen(false);
      toast.success('Cancel Transaction Successfully');
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
      toast.error(error);
    }
  };

  const handleChat = async ()=>{
    router.push('/chats');
  }

  return (
    <Drawer
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          router.push("/transactions");
        }
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        {/* //item._id */}
        <Link
          href={{ pathname: "/transactions", query: { id: id } }}
          shallow={true}
        >
          <Button className="">View Details</Button>
        </Link>
      </DrawerTrigger>
      <DrawerContent
        title={selectedTransaction?.title}
        className="bg-white flex flex-col rounded-t-lg shadow-xl transition-all duration-300 h-full w-[400px] mt-24 fixed bottom-0 right-0"
      >
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h1 className="text-heading3-bold font-bold mb-2">Transaction #1</h1>
          {/* Donor Section */}
          {selectedTransaction?.basketId?.image && (
            <div className="overflow-hidden rounded-t-lg">
              <img
                src={`${selectedTransaction?.basketId?.image}`}
                alt="Donation"
                className="w-full object-cover hover:scale-105 transition-scale duration-300"
                style={{ height: "150px" }}
              />
            </div>
          )}
          <div className="px-2 py-1">
            <div className="flex justify-between items-center mb-2">
              <h2
                className={`text-2xl text-heading4-bold font-bold ${
                  selectedTransaction?.type === "Request"
                    ? "text-sky-600"
                    : "text-emerald-600"
                }`}
              >
                {selectedTransaction?.basketId?.title}
              </h2>
            </div>
            <p className="text-gray-500">
              {selectedTransaction?.basketId?.description}
            </p>
            <div className="">
              <div className="flex justify-between align-middle">
                <p className="flex items-center text-gray-800 font-bold">
                  <RxPerson className="mr-2" size="20px" />
                  Donor:
                </p>
                <span>{selectedTransaction?.donorId?.username}</span>
              </div>
              <div className="flex justify-between align-middle">
                <p className="flex items-center text-gray-800 font-bold">
                  <RxSewingPin className="mr-2" size="20px" />
                  <span className="font-bold">Location:</span>
                </p>
                <span>
                  {extractStateAndZip(selectedTransaction?.basketId?.location)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTransaction?.basketId?.items
                  ?.slice(0, 2)
                  .map((item) => (
                    <Badge key={item?.id} className="bg-sky-100 text-black">
                      {item?.emoji} {item?.itemName}
                    </Badge>
                  ))}
                {selectedTransaction?.basketId?.items?.length > 2 && (
                  <Badge className="bg-sky-100 text-black">
                    +{selectedTransaction?.basketId?.items?.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <hr className="my-3" />

          {/* Requester Section */}
          {selectedTransaction?.basketrequestId?.image && (
            <div className="overflow-hidden rounded-t-lg">
              <img
                src={`${selectedTransaction?.basketrequestId?.image}`}
                alt="Request"
                className="w-full object-cover hover:scale-105 transition-scale duration-300"
                style={{ height: "150px" }}
              />
            </div>
          )}
          <div className="px-2 py-1">
            <div className="flex justify-between items-center mb-2">
              <h2
                className={`text-2xl text-heading4-bold font-bold ${
                  selectedTransaction?.type === "Request"
                    ? "text-sky-600"
                    : "text-emerald-600"
                }`}
              >
                {selectedTransaction?.basketrequestId?.title}
              </h2>
            </div>
            <p className="text-gray-500">
              {selectedTransaction?.type === "Donation"
                ? selectedTransaction?.basketrequestId?.description
                : selectedTransaction?.basketrequestId?.reason}
            </p>
            <div className="mt-4">
              <div className="flex justify-between align-middle">
                <p className="flex items-center text-gray-800 font-bold">
                  <RxPerson className="mr-2" size="20px" />
                  Requester:
                </p>
                <span>{selectedTransaction?.requesterId?.username}</span>
              </div>
              <div className="flex justify-between align-middle">
                <p className="flex items-center text-gray-800 font-bold">
                  <RxSewingPin className="mr-2" size="20px" />
                  <span className="font-bold">Location:</span>
                </p>
                <span>
                  {extractStateAndZip(
                    selectedTransaction?.basketrequestId?.location
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTransaction?.basketrequestId?.requests
                  ?.slice(0, 2)
                  .map((request) => (
                    <Badge key={request?.id} className="bg-sky-100 text-black">
                      {request?.emoji} {request?.itemName}
                    </Badge>
                  ))}
                {selectedTransaction?.basketrequestId?.requests?.length > 2 && (
                  <Badge className="bg-sky-100 text-black">
                    +
                    {selectedTransaction?.basketrequestId?.requests?.length - 2}{" "}
                    more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => handleAccept(selectedTransaction)}
              className="flex items-center justify-center gap-1 w-1/2 bg-green-500 hover:bg-green-400 text-white py-2 rounded transition duration-150 ease-in-out"
            >
              <IoMdCheckmarkCircleOutline size={20}></IoMdCheckmarkCircleOutline>
              Accept
            </button>
            <button
              onClick={() => handleCancel(selectedTransaction)}
              className="flex items-center justify-center gap-1 w-1/2 bg-red-500 hover:bg-red-400 text-white py-2 rounded transition duration-150 ease-in-out"
            >
              <AiOutlineCloseCircle size={20}></AiOutlineCloseCircle>
              Cancel
            </button>
          </div>
          <button onClick={()=> handleChat()} className="flex items-center justify-center gap-1 w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out mt-2">
            <CiChat2 size={20}></CiChat2>
            Let's connect
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerTransaction;
