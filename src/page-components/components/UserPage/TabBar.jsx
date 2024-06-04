import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveCardsList from "./ActiveCardsList";
import ProcessingCards from "./ProcessingCards";

import Profile from "../ProfilePage/ProfileComponent";

export function TabBar({ userId, firstName, lastName }) {
  const router = useRouter();
  const { tab } = router.query;

  return (
    <div className="flex flex-col gap-5 pt-5 pl-5">
      <div className="flex gap-10 ml-2">
        <Link href="/dashboard" className="font-medium text-4xl">
          Pick Me Food
        </Link>
        <span className=" text-2xl font-bold text-sky-600">
          {firstName} {lastName}
        </span>
      </div>
      <div className="flex gap-10">
        <Profile className="w-full" userId={userId}></Profile>

        <Tabs defaultValue={tab || "active"} className="w-full">
          <TabsList className="flex bg-white justify-start gap-20 ">
            <TabsTrigger value="active">
              <Link
                href={{
                  pathname: "/userpage",
                  query: { tab: "active-cards" },
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

          <TabsContent value="active" className="flex justify-normal gap-10 ">
            <ActiveCardsList></ActiveCardsList>
          </TabsContent>

          <TabsContent
            value="processing"
            className="flex justify-normal gap-10 "
          >
            <ProcessingCards> </ProcessingCards>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
