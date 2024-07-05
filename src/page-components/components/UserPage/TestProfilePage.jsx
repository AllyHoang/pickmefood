import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Profile from "./ProfileComponent";
import { FaPlus } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const TestProfilePage = ({
  userData,
  loadingUserData,
  userId,
  loggedInUserId,
}) => {
  const [numDonation, setNumDonation] = useState(null);
  const [numRequests, setNumRequests] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        fitstName: userData.fitstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        points: userData.points || 0,
        profileImage: userData.profileImage || "./person.jpg",
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch(`http://localhost:3000/api/baskets/${userId}`, {
            cache: "no-store",
          }),
          fetch(`http://localhost:3000/api/basketrequests/${userId}`, {
            cache: "no-store",
          }),
        ]);
        if (!donationRes.ok || !requestRes.ok) {
          throw new Error("Failed to fetch items");
        }
        const [donationData, requestData] = await Promise.all([
          donationRes.json(),
          requestRes.json(),
        ]);
        setNumDonation(donationData.baskets.length);
        setNumRequests(requestData.baskets.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, []);
  return (
    <div className="border-none flex gap-10 relative">
      <div className="profile-pic flex flex-col items-center mb-4">
        <img
          src={
            watch("profileImage") ||
            userData?.profileImage ||
            "/assets/person.jpg"
          }
          alt="profile"
          className="w-48 h-48 rounded-full mb-2 self-start"
        />
      </div>
      <div className="user-info flex flex-col info gap-5">
        <div className="flex flex-col ">
          <div className="first-last-name text-heading2-bold">
            {userData?.firstName}
            {userData?.lastName}
          </div>
          <div>@{userData?.username}</div>
        </div>
        <div className="flex gap-5">
          <Badge className="font-medium bg-sky-400 text-white">
            {numDonation} donations{" "}
          </Badge>
          <Badge className="font-medium bg-sky-400 text-white">
            {numRequests} requests{" "}
          </Badge>
        </div>
        <div className="w-3/4">
          This is a short hardcoded bio. I would like to add a field in user
          model to include bio, maybe maximum 50 words.
        </div>
      </div>
      {userId === loggedInUserId ? (
        <div className="absolute top-3 right-8">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-sky-400 flex items-center gap-2 hover:bg-sky-500">
                <FaPlus />
                Create new
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Request</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href="/add-request">Add manually</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Donation</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/add-item">Add manually</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/image-scan">Add with image scan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/video-scan">Add with video scan</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default TestProfilePage;
