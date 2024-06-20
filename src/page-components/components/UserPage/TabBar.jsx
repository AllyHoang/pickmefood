import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveCardsList from "./ActiveCardsList";
import ProcessingCards from "./ProcessingCards";
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
          <TabsTrigger value="active">
            <Link
              href={{
                pathname: "/userpage",
                // query: { tab: "active-cards" },
              }}
            >
              My Active Cards
            </Link>
          </TabsTrigger>
          <TabsTrigger value="processing">
            <Link
              href={{
                pathname: "/userpage",
                query: { tab: "processing-cards" },
              }}
            >
              My Processing Cards
            </Link>{" "}
          </TabsTrigger>
        </TabsList>

        <div className="overflow-y-auto h-screen">
          <TabsContent
            value="active"
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
                    <h1 className=" font-sans font-bold text-gray-700 mt-3">
                      Choose a method to add Donation
                    </h1>
                    <div className="flex flex-row items-center gap-8">
                      <Link href="add-item">
                        <Button className="bg-sky-400">Add Manually</Button>
                      </Link>

                      <Link href="image-scan">
                        <Button className="bg-sky-400">Scan items</Button>
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link href="add-request">
                  <Button className="bg-sky-400">Add Request</Button>
                </Link>
              </div>
            </div>

            <ActiveCardsList userId={userId}></ActiveCardsList>
          </TabsContent>

          <TabsContent
            value="processing"
            className="flex justify-normal gap-10 "
          >
            <ProcessingCards> </ProcessingCards>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

