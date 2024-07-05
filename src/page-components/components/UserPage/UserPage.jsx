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
import useUser from "@/hook/useUser";
import { FaPlus } from "react-icons/fa6";

const UserPage = ({ userId, loggedInUserId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { user: userData, loading: loadingUserData, error } = useUser(userId);
  const [activeTab, setActiveTab] = useState("my-requests");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col overflow-hidden h-screen gap-5 pt-5 pl-5 ">
      <TestProfilePage userId={userId} loggedInUserId={loggedInUserId}>
        {" "}
      </TestProfilePage>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs
          defaultValue={"my-requests"}
          className="w-full flex flex-col flex-1 overflow-hidden"
          onValueChange={(val) => setActiveTab(val)}
        >
          <TabsList className="flex bg-white justify-start gap-8 rounded-none py-0 border-b sticky top-0 z-10">
            <TabsTrigger value="my-requests">Requests</TabsTrigger>
            <TabsTrigger value="my-donations">Donations</TabsTrigger>
            <TabsTrigger value="my-receipts">Receipts</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent
              value="my-requests"
              className="flex flex-col justify-normal"
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

                {userId === loggedInUserId ? (
                  <Link href="/add-request">
                    <Button className="bg-sky-400">Add Request</Button>
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
            <TabsContent
              value="my-donations"
              className="flex flex-col justify-normal gap-5"
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

                {userId === loggedInUserId ? (
                  <Dialog>
                    <DialogTrigger className="flex ">
                      <Button className="bg-sky-400">Add Donation</Button>
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
            <TabsContent value="my-receipts">
              <ActiveCardsList
                userId={userId}
                loggedInUserId={loggedInUserId}
                type="Receipts"
                searchTerm={searchTerm}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserPage;
