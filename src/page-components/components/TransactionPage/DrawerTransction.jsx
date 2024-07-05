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
import SubDrawer from "./SubDrawer";

function DrawerTransaction({ selectedTransaction, id, handleOpenDialog }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const isDonor = currentUser?.id === selectedTransaction?.donorId._id;

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
      toast.success(
        "You have accepted this transcation. Please wait for others"
      );
    } catch (error) {
      console.error("Failed to accept transaction:", error);
      toast.error(error);
    }
  };

  const handleDoneTransaction = async (transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${transaction._id}/done`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Transaction accepted:", data);
      toast.success("Congratulation! Your transaction is completed");
    } catch (error) {
      console.error("Failed to finish transaction:", error);
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
      toast.success("Cancel Transaction Successfully");
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
      toast.error(error);
    }
  };

  const handleChat = async (selectedTransaction) => {
    const otherMemberId =
      selectedTransaction?.donorId._id !== currentUser.id
        ? selectedTransaction?.donorId._id
        : selectedTransaction?.requesterId._id;

    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser.id,
        members: [currentUser.id, otherMemberId],
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push(`/chats/${data.chat._id}`);
    }
  };

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
      <DrawerTrigger asChild className="self-center">
        {/* //item._id */}
        <Link
          href={{ pathname: "/transactions", query: { id: id } }}
          shallow={true}
        >
          View Details
        </Link>
      </DrawerTrigger>

      <DrawerContent className="bg-white flex flex-grow flex-col rounded-t-lg shadow-xl transition-all duration-300 h-screen w-[600px] mt-24 fixed bottom-0 right-0">
        <div className="">
          <div className="flex flex-col gap-10 p-2 mt-5">
            <SubDrawer
              user={selectedTransaction?.donorId}
              basket={selectedTransaction?.basketId}
              type="Donation"
            ></SubDrawer>

            <SubDrawer
              user={selectedTransaction?.requesterId}
              basket={selectedTransaction?.basketrequestId}
              type="Request"
            ></SubDrawer>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            {((isDonor && !selectedTransaction?.agreedByDonor) ||
              (!isDonor && !selectedTransaction?.agreedByRequester)) &&
              selectedTransaction?.status === "pending" && (
                <button
                  onClick={() => {
                    handleAccept(selectedTransaction);
                    // router.reload();
                  }}
                  className="flex items-center justify-center gap-1 w-1/2 bg-green-500 hover:bg-green-400 text-white py-2 rounded transition duration-150 ease-in-out"
                >
                  <IoMdCheckmarkCircleOutline
                    size={20}
                  ></IoMdCheckmarkCircleOutline>
                  Accept
                </button>
              )}
            {selectedTransaction?.status === "connected" && (
              <button
                onClick={() => {
                  handleDoneTransaction(selectedTransaction);
                  // router.reload();
                }}
                className="flex items-center justify-center gap-1 w-1/2 bg-green-500 hover:bg-green-400 text-white py-2 rounded transition duration-150 ease-in-out"
              >
                <AiOutlineCloseCircle size={20}></AiOutlineCloseCircle>
                Done
              </button>
            )}
            {selectedTransaction?.status !== "canceled" &&
              selectedTransaction?.status !== "accepted" && (
                <button
                  onClick={() => {
                    handleCancel(selectedTransaction);
                    // router.reload();
                  }}
                  className={`flex items-center justify-center gap-1 ${
                    (isDonor && selectedTransaction?.agreedByDonor) ||
                    (!isDonor && selectedTransaction?.agreedByRequester)
                      ? "w-full"
                      : "w-1/2"
                  } bg-red-500 hover:bg-red-400 text-white py-2 gap-1 rounded transition duration-150 ease-in-out`}
                >
                  <AiOutlineCloseCircle size={20}></AiOutlineCloseCircle>
                  Cancel
                </button>
              )}
          </div>
          {selectedTransaction?.agreedByRequester &&
            selectedTransaction?.agreedByDonor && (
              <button
                onClick={() => {
                  handleChat(selectedTransaction);
                }}
                className="flex items-center justify-center gap-1 w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out mt-2"
              >
                <CiChat2 size={20} />
                Let's connect
              </button>
            )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerTransaction;
