import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveCardsList from "./ActiveCardsList";
import ProcessingCards from "./ProcessingCards";
import AddItem from "../addItemForm/addItemForm";
import AddRequest from "../addRequestForm/addRequestForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TestProfilePage from "../ProfilePage/TestProfilePage";

export function TabBar({ userId, firstName, lastName }) {
  const router = useRouter();
  const { tab } = router.query;
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setUploadedUrl(uploadedUrl);
  };

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
                  <DialogContent className="min-w-fit w-3/4 h-4/5">
                    <AddItem userId={userId}></AddItem>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-sky-400">Add a Request</Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-fit w-3/4 h-4/5">
                    <AddRequest userId={userId}></AddRequest>
                  </DialogContent>
                </Dialog>
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
