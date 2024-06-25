import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveCardsList from "./ActiveCardsList";
import AddItem from "../addItemForm/addItemForm";
import AddRequest from "../addRequestForm/addRequestForm";
import ImageScan from "../ImageScan/ImageScan";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Profile from "../ProfilePage/ProfileComponent";
import TestProfilePage from "../ProfilePage/TestProfilePage";

export function TabBar({ userId, firstName, lastName }) {
  const router = useRouter();
  const { tab } = router.query;

  return (
    <div className="flex flex-col overflow-hidden gap-5 pt-5 pl-5 ">
      <TestProfilePage userId={userId}> </TestProfilePage>

      <Tabs
        defaultValue={tab || "active"}
        className="w-full flex flex-col h-screen"
      >
        <TabsList className="flex bg-white justify-start gap-20 ">
          <TabsTrigger value="my-requests">
            <Link
              href={{
                pathname: "/userpage",
                // query: { tab: "active-cards" },
              }}
            >
              My Requests
            </Link>
          </TabsTrigger>
          <TabsTrigger value="my-donations">
            <Link
              href={{
                pathname: "/userpage",
                query: { tab: "my-donations" },
              }}
            >
              My Donations
            </Link>{" "}
          </TabsTrigger>
        </TabsList>

        <div className="overflow-y-auto h-screen">
          <TabsContent
            value="my-requests"
            className="flex flex-col justify-normal gap-5 "
          >
            <div className="flex items-end gap-5">
              <div className="flex gap-4 relative top-2">
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-sky-400">Add a Donation</Button>
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

                <Link href="add-request">
                  <Button className="bg-sky-400">Add Request</Button>
                </Link>
              </div>
            </div>

            <ActiveCardsList userId={userId} type="Request" />
          </TabsContent>

          <TabsContent
            value="my-donations"
            className="flex justify-normal gap-10 "
          >
            <ActiveCardsList userId={userId} type="Donation" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
