import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import useUser from "@/hook/useUser";

function DialogComponent({ handleCloseModal, otherItem, openDialog, keyItem }) {
  // Get user state from redux
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  // user is other user
  // currentUser is user who is authenticated
  const { user } = useUser(otherItem.userId);
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    const urlCreateTransaction = otherItem.type === "Donation" ? "request" : "item";
    let transactionData;
    let testTransaction;
    console.log(otherItem);
    //US is a donor
    if (otherItem.type === "Request") {
      transactionData = {
        userId: currentUser.id,
        itemId: value || null,
        otherUserId: user._id,
        requestId: otherItem.id,
      };
      if(!value){
        transactionData.quantity = otherItem.quantity;
        transactionData.description = otherItem.reason;
      } 
      //testTransaction is only for debugging purpose
      testTransaction = {
        type: "You are Donation",
        donorId: currentUser.id,
        donorName: currentUser.username,
        donationId: value || null,
        requesterId: user._id,
        requesterName: user?.username,
        requestId: otherItem.id,
        requestName: otherItem.itemName,
      }
      
    } else {
      //US is a requestor
      transactionData = {
        userId: currentUser.id,
        itemId: otherItem.id,
        otherUserId: user._id,
        requestId: value || null,
      };
      if(!value){
        transactionData.quantity = otherItem.quantity;
        transactionData.description = otherItem.description;
        transactionData.itemName = otherItem.itemName;
        transactionData.emoji = otherItem.emoji;
      } 
      //testTransaction is only for debugging purpose
      testTransaction = {
        type: "You are Requester",
        donorId: user._id,
        donorName: user?.username,
        donationId: otherItem.id,
        donationName: otherItem.itemName,
        requesterId: currentUser.id,
        requesterName: currentUser.username,
        requestId: value || null,
      }
    }
    console.log("Test Transaction", testTransaction);
  
    // Ensure this log runs
    try {
      const response = await fetch(`/api/transactions/${urlCreateTransaction}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) {
        if(response.status === 409){
          throw new Error("Transaction already exisited");
        }
        else{
          throw new Error("Failed to create transaction");
        }
      }
  
      const data = await response.json();
      console.log(`Transaction created successfully: ${urlCreateTransaction}`, data);
  
      // Closing dialog
      toast.success("Create transaction successfully");
      //TODO: Might navigate user to Me Page
      handleCloseModal();
    } catch (error) {
      console.error("Error creating transaction:", error.message);
      toast.error(error.message);
    }
  };
  
  //Fetch CurrentUser's donations
  useEffect(() => {
    if(otherItem.type === "Request"){
      const fetchItems = async () => {
        try {
          const donationRes = await fetch(`/api/activeItem/${currentUser.id}`, {
            cache: "no-store",
          });
          if (!donationRes.ok) {
            throw new Error("Failed to fetch items");
          }
  
          const donationData = await donationRes.json();
          setItems(
            donationData.items.map((item, index) => ({
              ...item,
              value: item._id,
              label: `${item.emoji} ${item.itemName}: ${item.description} (Quantity: ${item.quantity})`,
            }))
          );
        } catch (error) {
          console.error("Error loading items:", error);
        }
      };
      fetchItems();
    }
    else{
      const fetchRequests = async () => {
        try {
          const requestRes = await fetch(`/api/activeRequest/${currentUser.id}`, {
            cache: "no-store",
          });
          if (!requestRes.ok) {
            throw new Error("Failed to fetch items");
          }
          const requestData = await requestRes.json();
          setRequests(
            requestData.requests.map((request, index) => ({
              ...request,
              value: request._id,
              label: `${request.emoji} ${request.itemName}: ${request.reason} (Quantity: ${request.quantity})`,
            }))
          );
        } catch (error) {
          console.error("Error loading items:", error);
        }
      };
      fetchRequests();
    }
  }, [currentUser.id]);

  return (
    <Dialog open={openDialog} className="relative z-50">
      <DialogContent className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl mx-auto">
        <form id={`create-transaction-form-${keyItem}`} onSubmit={handleCreateTransaction}>
          <DialogHeader className="border-b pb-4 mb-4">
            <h2 className="text-heading2-bold text-sky-500">Create New Transaction</h2>
            <hr className="border-l mb-4"></hr>
            <DialogDescription className="mt-2 text-base text-gray-600">
              <ul className="list-disc pl-5 space-y-1 text-gray-500">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-sky-400 rounded-full"></span>
                  This action will initiate a transaction process that cannot be undone once confirmed.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-sky-400 rounded-full"></span>
                  It is crucial to review the transaction details carefully before proceeding.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-sky-500 rounded-full"></span>
                  Below, you will find the details of the donor, the requester, and the item involved in the transaction.
                </li>
              </ul>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <img src={currentUser.profileImage} alt="Donor Avatar" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">{currentUser.username}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img src={user?.profileImage} alt="Requester Avatar" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-4">
                    <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      id="item-name"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      defaultValue={otherItem?.itemName}
                      readOnly
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      rows="3"
                      defaultValue={otherItem?.type === "Donation" ? otherItem?.description : otherItem?.reason}
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      defaultValue={otherItem?.quantity}
                      readOnly
                    />
                  </div>
                </div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">Existing {otherItem.type ==="Request" ? "Donation 🚀" : "Request 🤲"}</h4>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-left"
                    >
                      
                      {otherItem.type === "Request" 
                        ? (value ? items.find((item) => item.value === value)?.label : "Select Your Donation")
                        : (value ? requests.find((request) => request.value === value)?.label : "Select Your Request")
                      }
      
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-y-auto">
                    <Command>
                      <CommandInput placeholder="Search existing request" className="border-b border-gray-200 p-2" />
                      <CommandEmpty className="p-2 text-center text-gray-500">No {otherItem.type ==="Request" ? "donation" : "request"} found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-48 rounded-md">
                          {otherItem.type === "Request" 
                            ? items.map((item) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                  }}
                                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === item.value ? "opacity-100 text-sky-500" : "opacity-0"
                                    )}
                                  />
                                  {item.label}
                                </CommandItem>
                              ))
                            : requests.map((request) => (
                                <CommandItem
                                  key={request.value}
                                  value={request.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                  }}
                                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === request.value ? "opacity-100 text-sky-500" : "opacity-0"
                                    )}
                                  />
                                  {request.label}
                                </CommandItem>
                              ))
                          }
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button
              variant="ghost"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
              type="submit"
              form={`create-transaction-form-${keyItem}`}
              onSubmit={handleCreateTransaction}
            >
              Create Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default DialogComponent;
