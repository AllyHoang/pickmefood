import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./addItemForm.module.css"; // Import the CSS file

export default function AddItem() {
  const [itemName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !quantity || !expirationDate) {
      alert("Please fill in the missing boxes");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/items/page", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          itemName,
          description,
          quantity,
          expirationDate,
        }),
      });

      if (res.ok) {
        router.push("/active-donation");
      } else {
        throw new Error("Failed to create an item");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>
          🥰What item would you like to donate?🥰
        </h2>
        <label htmlFor="name" className={styles["label-text"]}>
          Item name:
        </label>
        <input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={itemName}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: Banana"
        />

        <label htmlFor="description" className={styles["label-text"]}>
          Item description (optional):
        </label>
        <input
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: Delicious but I don't want it"
        />

        <label htmlFor="quantity" className={styles["label-text"]}>
          Item quantity:
        </label>
        <input
          id="quantity"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: 1,2"
        />

        <label htmlFor="expirationDate" className={styles["label-text"]}>
          Item expiration date:
        </label>
        <input
          id="expirationDate"
          onChange={(e) => setExpirationDate(e.target.value)}
          value={expirationDate}
          className={styles["input-field"]}
          type="text"
          placeholder="Format: 04/05/24"
        />

        <button type="submit" className={styles["submit-button"]}>
          Add Item
        </button>
      </form>
    </div>
  );
}
