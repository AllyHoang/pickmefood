import Loader from "../Loader";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PersonOutline } from "@mui/icons-material";
import styles from "./ProfileComponent.module.css";

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
          username: fetchedUserInfo.username || "",
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
        username: data.username,
        profileImage: data.profileImage,
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
    <div className={styles["profile-page"]}>
      <h1 className={styles["text-heading3-bold"]}>Edit Your Profile</h1>

      <form
        className={styles["edit-profile"]}
        onSubmit={handleSubmit(updateUser)}
      >
        <div className={styles.input}>
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className={styles["input-field"]}
            defaultValue={user?.username || ""}
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
          <p className={styles["text-red-500"]}>{errors.username.message}</p>
        )}

        <div className={styles.flex}>
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className={`${styles["w-40"]} ${styles["h-40"]} ${styles["rounded-full"]}`}
          />
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
            <p className={styles["text-body-bold"]}>Upload new photo</p>
          </CldUploadButton>
        </div>

        <button className={styles.btn} type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
