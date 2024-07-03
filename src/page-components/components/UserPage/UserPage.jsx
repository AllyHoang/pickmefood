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
import { GoSearch } from "react-icons/go";
import { Input } from "@/components/ui/input";

const UserPage = ({ userId, loggedInUserId }) => {
  const router = useRouter();
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
        </TabsList>

        <div className="overflow-y-auto h-screen">
          <TabsContent
            value="my-requests"
            className="flex flex-col justify-normal gap-5 "
          >
            {userId === loggedInUserId ? (
              <div className="flex flex-row mt-4 gap-6">
                <div className="flex-grow flex items-center gap-4">
                  <div className="relative flex-grow pl-3">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl"
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <GoSearch className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
                <Link href="/add-request" className="pr-4">
                  <Button className="bg-sky-400">Add Request</Button>
                </Link>
              </div>
            ) : (
              <></>
            )}

            <ActiveCardsList
              userId={userId}
              loggedInUserId={loggedInUserId}
              type="Request"
            />
          </TabsContent>

          <TabsContent
            value="my-donations"
            className="flex flex-col justify-normal gap-5 "
          >
            {userId === loggedInUserId ? (
              <div className="flex flex-row mt-4 gap-6">
                <div className="flex-grow flex items-center gap-4">
                  <div className="relative flex-grow pl-3">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl"
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <GoSearch className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="pr-4">
                  <Dialog>
                    <DialogTrigger className="flex">
                      <Button className="bg-sky-400">Add Donation</Button>
                    </DialogTrigger>
                    {/* <DialogContent className="min-w-fit w-3/4 h-4/5">
                  <AddItem userId={userId}></AddItem> */}
                    <DialogContent className="min-w-fit w-fit h-fit flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center gap-4 mt-3">
                        <Link href="add-item">
                          <Button className="bg-sky-400">
                            Add Items Manually
                          </Button>
                        </Link>

                        <Link href="image-scan">
                          <Button className="bg-sky-400 px-6">
                            Image Scan Items
                          </Button>
                        </Link>

                        <Link href="video-scan">
                          <Button className="bg-sky-400 px-6">
                            Video Scan Items
                          </Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <></>
            )}

            <ActiveCardsList
              userId={userId}
              loggedInUserId={loggedInUserId}
              type="Donation"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UserPage;
