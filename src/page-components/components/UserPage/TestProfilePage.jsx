import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Profile from "./ProfileComponent";

const TestProfilePage = ({ userId, loggedInUserId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
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
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        const fetchedUserInfo = data.user;
        if (!fetchedUserInfo) {
          throw new Error("No user data found");
        }
        setUser(fetchedUserInfo);
        reset({
          fitstName: fetchedUserInfo.fitstName || "",
          lastName: fetchedUserInfo.lastName || "",
          username: fetchedUserInfo.username || "",
          points: fetchedUserInfo.points || 0,
          profileImage: fetchedUserInfo.profileImage || "./person.jpg",
        });
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, reset]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch(`http://localhost:3000/api/activeItem/${userId}`, {
            cache: "no-store",
          }),
          fetch(`http://localhost:3000/api/activeRequest/${userId}`, {
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
        setNumDonation(donationData.items.length);
        setNumRequests(requestData.requests.length);
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
            watch("profileImage") || user?.profileImage || "/assets/person.jpg"
          }
          alt="profile"
          className="w-48 h-48 rounded-full mb-2 self-start"
        />
      </div>
      <div className="user-info flex flex-col info gap-5">
        <div className="flex flex-col ">
          <div className="first-last-name text-heading2-bold">
            {user?.firstName}
            {user?.lastName}
          </div>
          <div>@{user?.username}</div>
        </div>
        <div className="flex gap-5">
          <Badge className="font-medium bg-sky-500 hover:bg-sky-500">
            {" "}
            {numDonation} donations{" "}
          </Badge>
          <Badge className="font-medium bg-sky-500 hover:bg-sky-500">
            {" "}
            {numRequests} requests{" "}
          </Badge>
        </div>

        <div className="w-3/4">
          {" "}
          This is a short hardcoded bio. I would like to add a field in user
          model to include bio, maybe maximum 50 words.
        </div>
      </div>

      {userId === loggedInUserId ? (
        <div className="absolute top-3 right-8">
          <Dialog modal={false}>
            <DialogTrigger>
              <Button className="bg-sky-400 text-white">Edit Profile</Button>
            </DialogTrigger>
            {/* <DialogContent onInteract = {(e) => e.preventDefault()}> */}
            <DialogContent
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Profile userId={userId}></Profile>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TestProfilePage;
