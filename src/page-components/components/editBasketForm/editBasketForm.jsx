import { useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { Button } from "@/components/ui/button";

function EditBasketForm({ isOpen, onClose, basket, onSave }) {
  const [title, setTitle] = useState(basket?.title || "");
  const [description, setDescription] = useState(basket?.description || "");
  const [location, setLocation] = useState(basket?.location || "");
  const [items, setExpiryDate] = useState(basket.type === "Donation" ? basket?.expiryDate : "");
  

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/baskets/${basket._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, location, expiryDate }),
      });

      if (response.ok) {
        const updatedBasket = await response.json();
        onSave(updatedBasket);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error updating basket:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating basket:", error);
    }
  };

  return (
    <Dialog isOpen={isOpen} onDismiss={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
      <DialogContent className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-heading2-bold mb-4">Edit Basket</h2>
        <label className="block mb-2">
          Title:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Description:
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Location:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Expiry Date:
          <input
            type="date"
            className="w-full border rounded p-2"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button className="bg-gray-300" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-sky-400" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditBasketForm;
