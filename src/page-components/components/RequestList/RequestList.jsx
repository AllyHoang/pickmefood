import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import styles from "./RequestList.module.css";
import RemoveRequestsBtn from "../RemoveRequestsButton";

const RequestList = ({ userId }) => {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/activeRequest/${userId}`,
          {
            cache: "no-store",
          }
        );

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
              <div className={styles.itemReason}>Reason: {t.reason}</div>
              <div className={styles.itemQuantity}>Quantity: {t.quantity}</div>
              <div className={styles.postedDate}>
                Posted Date: {formatDate(t.createdAt)}
              </div>
              <div className={styles.location}>Location: {t.location}</div>
            </div>
            <div className={styles.btnGroup}>
              <RemoveRequestsBtn id={t._id} />
              <Link href={`/edit-request/${t._id}`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))}
        <div className={styles.buttonContainer}>
          <div className={styles.addButton}>
            <Link href={"/add-request"}>Add</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestList;
