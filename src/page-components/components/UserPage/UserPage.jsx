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
import { useState } from "react";
import useUser from "@/hook/useUser";
import { FaPlus } from "react-icons/fa6";

const UserPage = ({ userId, loggedInUserId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const { user: userData, loading: loadingUserData, error } = useUser(userId);
  const [activeTab, setActiveTab] = useState("my-requests");

  return (
    <div className="base-container flex flex-col gap-4 h-full max-h-full">
      <TestProfilePage
        userData={userData}
        loadingUserData={loadingUserData}
        userId={userId}
        loggedInUserId={loggedInUserId}
      />
      <Tabs
        onValueChange={(val) => setActiveTab(val)}
        defaultValue={"my-requests"}
        className="w-full flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="flex bg-white justify-start gap-8 rounded-none py-0 border-b">
          <TabsTrigger value="my-requests">Requests</TabsTrigger>
          <TabsTrigger value="my-donations">Donations</TabsTrigger>
        </TabsList>
        <TabsContent
          value="my-requests"
          className={`flex flex-col justify-normal overflow-y-auto mt-0 ${
            activeTab === "my-requests" && "pt-6 pb-12"
          }`}
        >
          <ActiveCardsList
            userData={userData}
            userId={userId}
            loggedInUserId={loggedInUserId}
            type="Request"
            searchTerm={searchTerm}
          />
        </TabsContent>
        <TabsContent
          value="my-donations"
          className={`flex flex-col justify-normal overflow-y-auto mt-0 ${
            activeTab === "my-donations" && "pt-6 pb-12"
          } px-1`}
        >
          <ActiveCardsList
            userId={userId}
            loggedInUserId={loggedInUserId}
            type="Donation"
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default UserPage;