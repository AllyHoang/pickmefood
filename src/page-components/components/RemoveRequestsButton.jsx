"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RemoveRequestsBtn({ id }) {
  const router = useRouter();
  const removeItem = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/changeBasketRequests/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <Button
      onClick={removeItem}
      className="w-10/12 fixed bottom-1 left-10 bg-red-500"
    >
      Remove
    </Button>
  );
}
