import Loader from "../Loader";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PersonOutline } from "@mui/icons-material";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const formData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        profileImage: data.profileImage,
        points: data.points,
      };

      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Card className="p-6 mt-3">
      <form onSubmit={handleSubmit(updateUser)}>
        <div className="flex flex-col items-center mb-4">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            folder="profile_images"
            onSuccess={(result) =>
              setValue("profileImage", result?.info?.secure_url)
            }
            onFailure={(error) =>
              console.error("Cloudinary upload error:", error)
            }
            uploadPreset="zoa1vsa7"
          >
            <img
              src={
                watch("profileImage") ||
                user?.profileImage ||
                "/assets/person.jpg"
              }
              alt="profile"
              className="w-40 h-40 rounded-full mb-2"
            />
          </CldUploadButton>
        </div>

        <div className="mb-2">
          <label htmlFor="username" className="block font-bold mb-1">
            User Name
          </label>
          <div className="flex items-center">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                validate: (value) => {
                  if (value.length < 3) {
                    return "Username must be at least 3 characters";
                  }
                },
              })}
              defaultValue={user?.username || ""}
              className="flex-1"
            />
          </div>
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="firstName" className="block font-bold mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="First Name"
            {...register("firstName", {
              required: "First name is required",
            })}
            defaultValue={user?.firstName || ""}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="lastName" className="block font-bold mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last Name"
            {...register("lastName", {
              required: "Last name is required",
            })}
            defaultValue={user?.lastName || ""}
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <div className="flex justify-center mt-3">
          <Button type="submit" className="w-half bg-sky-400">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Profile;

