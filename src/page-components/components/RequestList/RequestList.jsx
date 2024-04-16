import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import styles from "./requestList.module.css";
import RemoveRequestsBtn from "../RemoveRequestsBtn";

const RequestList = () => {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/requests/page", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await res.json();
        setRequests(data.requests); 
      } catch (error) {
        console.log("Error loading requests: ", error);
      }
    };

    fetchRequests();
  }, []); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!requests) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.itemContainer}>
        {requests.map((t) => (
          <div key={t._id} className={styles.item}>
            <div className={styles.itemContent}>
              <h2 className={styles.itemTitle}>{t.itemName}</h2>
              <div className={styles.itemDescription}>
                Description: {t.description}
              </div>
              <div className={styles.itemQuantity}>Quantity: {t.quantity}</div>
              <div className={styles.postedDate}>
                Posted Date: {formatDate(t.createdAt)}
              </div>
            </div>
            <div className={styles.btnGroup}>
              <RemoveRequestsBtn id={t._id} />
              <Link href={`/editRequest/${t._id}/page`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))}
        <div className={styles.buttonContainer}>
          <div className={styles.addButton}>
            <Link href={"/addRequest/page"}>Add</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestList;
