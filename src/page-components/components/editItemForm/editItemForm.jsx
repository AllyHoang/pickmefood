import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../addItemForm/addItemForm.module.css"; //use the same CSS with adding item form

export default function EditItem({ id }) {
  const [itemName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/items/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();
        const fetchedItemInfo = data.data.item;
        setName(fetchedItemInfo.itemName);
        setDescription(fetchedItemInfo.description);
        setQuantity(fetchedItemInfo.quantity);
        setExpirationDate(fetchedItemInfo.expirationDate);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItemData();
  }, [id]);

  const handleSubmit = async (e) => {
    if (!itemName || !quantity || !expirationDate) {
      alert("Please fill in the missing boxes");
      return;
    }
    try {
      e.preventDefault();
      const res = await fetch(`http://localhost:3000/api/items/${id}`, {
        method: "PUT",
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
        throw new Error("Failed to edit item");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>Edit Item Information</h2>
        <label htmlFor="name" className={styles["label-text"]}>
          Item name:
        </label>
        <input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={itemName}
          className={styles["input-field"]}
          type="text"
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
        />

        <button type="submit" className={styles["submit-button"]}>
          Edit Item
        </button>
      </form>
    </div>
  );
}
