import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveCardsList from "./ActiveCardsList";
import ProcessingCards from "./ProcessingCards";

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
              <div className="flex gap-2 relative top-2">
                <Button className="bg-sky-400">
                  {" "}
                  <Link href="/add-item" className="font-medium">
                    {" "}
                    Add a Donation{" "}
                  </Link>{" "}
                </Button>
                <Button className="bg-emerald-400">
                  {" "}
                  <Link href="/add-request" className="font-medium">
                    {" "}
                    Add a Request{" "}
                  </Link>{" "}
                </Button>
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
