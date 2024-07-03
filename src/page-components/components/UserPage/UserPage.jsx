/**
 * 3 sub pages: Profile, My donations and requests, Processing donations and requests
 *
 */
import { useRouter } from "next/router";
// import { TabBar } from "./TabBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import ActiveCardsList from "./ActiveCardsList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TestProfilePage from "./TestProfilePage";
import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
const UserPage = ({ userId, loggedInUserId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col overflow-hidden gap-5 pt-5 pl-5 ">
      <TestProfilePage userId={userId} loggedInUserId={loggedInUserId}>
        {" "}
      </TestProfilePage>

      <Tabs
        defaultValue={"my-requests"}
        className="w-full flex flex-col h-screen"
      >
        <TabsList className="flex bg-white justify-start gap-20 ">
          <TabsTrigger value="my-requests">
            {userId === loggedInUserId ? "My Requests" : "Requests"}
          </TabsTrigger>
          <TabsTrigger value="my-donations">
            {userId === loggedInUserId ? "My Donations" : "Donations"}
          </TabsTrigger>
          {userId === loggedInUserId ? (
            <TabsTrigger value="my-receipts">My Receipts</TabsTrigger>
          ) : (
            <></>
          )}
        </TabsList>

        <div className="overflow-y-auto h-screen">
          <TabsContent
            value="my-requests"
            className="flex flex-col justify-normal "
          >
            <div className="flex justify-between items-center mb-2 mt-2 px-5 gap-5 ">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GoSearch className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <Button className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-400 rounded transition duration-150 ease-in-out relative right-3">
                Search
              </Button>

              {userId === loggedInUserId ? (
                <Link href="/add-request">
                  <Button className="bg-emerald-400">Add Request</Button>
                </Link>
              ) : (
                <></>
              )}
            </div>
            <ActiveCardsList
              userId={userId}
              loggedInUserId={loggedInUserId}
              type="Request"
              searchTerm={searchTerm}
            />
          </TabsContent>
          {
            //receipts content goes here
          }
          <TabsContent
            value="my-donations"
            className="flex flex-col justify-normal gap-5 "
          >
            <div className="flex justify-between items-center -mb-2 px-5 gap-5 ">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GoSearch className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <Button className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-400 rounded transition duration-150 ease-in-out relative right-3">
                Search
              </Button>

              {userId === loggedInUserId ? (
                <Dialog>
                  <DialogTrigger className="flex ">
                    <Button className="bg-emerald-400">Add Donation</Button>
                  </DialogTrigger>
                  {/* <DialogContent className="min-w-fit w-3/4 h-4/5">
                  <AddItem userId={userId}></AddItem> */}
                  <DialogContent className="w-1/5 flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-4 mt-3 ">
                      <p className="text-body-medium ">Choose a Method </p>
                      <Separator />
                      <Link href="/add-item">
                        <p className=" font-bold"> Manual Add </p>
                      </Link>
                      <Separator />
                      <Link href="/image-scan">
                        {" "}
                        <p className="text-emerald-400 font-bold">
                          {" "}
                          Upload Image{" "}
                        </p>
                      </Link>
                      <Separator />
                      <Link href="/video-scan ">
                        <p className="text-sky-400 font-bold"> Video Scan </p>
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <></>
              )}
            </div>

            <ActiveCardsList
              userId={userId}
              loggedInUserId={loggedInUserId}
              type="Donation"
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="my-receipts"></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UserPage;
