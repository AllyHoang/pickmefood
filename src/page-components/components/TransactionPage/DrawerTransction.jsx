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
  
  
  function DrawerTransaction({selectedBasket, id, handleOpenDialog}) {
      const [open ,setOpen] = useState(false);
      const router = useRouter();
      console.log(selectedBasket);
      const {loading, error, currentUser} = useSelector((state) => state.user);

      const handleAccept = async (selectedBasket) => {
        try {
          let url;
          if(selectedBasket.donorId._id === currentUser.id){
            url= "agree-donor";
          }
          else{
            url= "agree-requester";
          }
          const response = await fetch(`/api/transactions/${selectedBasket._id}/${url}`, {
            method: 'PUT',
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log('Transaction accepted:', data);s
        } catch (error) {
          console.error('Failed to accept transaction:', error);
        }
      };
      
      const handleCancel = async (selectedBasket) => {
        try {
          const response = await fetch(`/api/transactions/${selectedBasket._id}/canceled`, {
            method: 'PUT',
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log('Transaction canceled:', data);
        } catch (error) {
          console.error('Failed to cancel transaction:', error);
        }
      };
      
      return (
          <Drawer onOpenChange={(open)=>{
            setOpen(open);
            if(!open){
              router.push("/transactions");
            }
  
          }} direction="right">
          <DrawerTrigger asChild>
            {/* //item._id */}
            <Link href = {{pathname: '/transactions', query:{id: id}}} shallow={true}>
              <Button
                className=""
              >
                View Details
              </Button>
            </Link>
          </DrawerTrigger>
          <DrawerContent
            title={selectedBasket?.title}
            className="bg-white flex flex-col rounded-t-lg shadow-xl transition-all duration-300 h-full w-[400px] mt-24 fixed bottom-0 right-0"
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              {selectedBasket?.image && (
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={`${selectedBasket?.image}`}
                    alt="Donation"
                    className="w-full object-cover hover:scale-105 transition-scale duration-300"
                    style={{ height: "200px" }} />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className={`text-2xl text-heading4-bold font-bold  ${selectedBasket?.type === "Request"
                        ? "text-sky-600"
                        : "text-emerald-600"}`}
                  >
                    {selectedBasket?.title}
                  </h2>
                </div>
                <p className="text-gray-500">
                  {selectedBasket?.type === "Donation" ? selectedBasket?.description : selectedBasket?.reason}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between align-middle">
                    <p className="flex items-center text-gray-800 font-bold">
                      <RxPerson className="mr-2" size="20px" />
                      {selectedBasket?.type === "Request"
                        ? "Requester"
                        : "Donor"}
                      :
                    </p>
                    <span>{selectedBasket?.userId?.username}</span>
                  </div>
                  <div className="flex justify-between align-middle ">
                    <p className="flex items-center text-gray-800 font-bold">
                      <RxSewingPin className="mr-2" size="20px" />
                      <span className="font-bold">Location:</span>
                    </p>
                    <span>{selectedBasket?.location}</span>
                  </div>
                  {selectedBasket?.expiryDate && (
                    <div className="flex justify-between align-middle ">
                      <p className="flex items-center text-gray-800 font-bold">
                        <RxClock className="mr-2" size="20px" />
                        Expires:
                      </p>
                      <span>{selectedBasket?.expiryDate}</span>
                    </div>
                  )}
                </div>
                {/* onClick={()=> handleOpenDialog(true)} */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button onClick={()=>handleAccept(selectedBasket)} className="w-full bg-green-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out">
                      Accept
                    </button>
                    <button onClick={()=>handleCancel(selectedBasket)} className="w-full bg-red-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out">
                      Cancel
                    </button>
                    <button className="w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out">
                      Let's chat
                    </button>
  
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )
  }
  
  export default DrawerTransaction
  