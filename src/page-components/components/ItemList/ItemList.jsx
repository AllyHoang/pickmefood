import React, { useState, useEffect } from "react";
import Link from "next/link";
import RemoveBtn from "../RemoveButton";
import { HiPencilAlt } from "react-icons/hi";
import styles from "./ItemList.module.css"; // Import CSS module

const ItemList = ({ userId }) => {
  const [items, setItems] = useState(null); // State to hold items

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/activeItem/${userId}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await res.json();
        setItems(data.items); // Update state with fetched items
      } catch (error) {
        console.log("Error loading items: ", error);
      }
    };

    fetchItems(); // Call the async function to fetch items
  }, []); // Empty dependency array to run effect only once

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Change the format as needed
  };

  // Render loading indicator while items are being fetched
  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.itemContainer}>
        {items.map((t) => (
          <div key={t._id} className={styles.item}>
            <div className={styles.itemContent}>
              <h2 className={styles.itemTitle}>{t.itemName}</h2>
              <div className={styles.itemDescription}>
                Description: {t.description}
              </div>
              <div className={styles.itemQuantity}>Quantity: {t.quantity}</div>
              <div className={styles.itemExpDate}>
                Expiration Date: {t.expirationDate}
              </div>
              <div className={styles.postedDate}>
                Posted Date: {formatDate(t.createdAt)}
              </div>
              <div className={styles.location}>Location: {t.location}</div>
            </div>
            <div className={styles.btnGroup}>
              <RemoveBtn id={t._id} />
              <Link href={`/edit-item/${t._id}`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))}
        <div className={styles.buttonContainer}>
          <div className={styles.addButton}>
            <Link href={"/add-item"}>Add</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemList;
