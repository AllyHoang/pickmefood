// // components/MyDonationsRequests.js
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import RemoveBtn from "../RemoveButton";
// import { HiPencilAlt } from "react-icons/hi";
// const ActiveCardsList = ({ userId }) => {
//   const [items, setItems] = useState(null);
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const [donationRes, requestRes] = await Promise.all([
//           fetch(`/api/activeItem/${userId}`, { cache: "no-store" }),
//           fetch(`/api/activeRequest/${userId}`, { cache: "no-store" }),
//         ]);
//         if (!donationRes.ok || !requestRes.ok) {
//           throw new Error("Failed to fetch items");
//         }
//         const [donationData, requestData] = await Promise.all([
//           donationsRes.json(),
//           requestsRes.json(),
//         ]);

//         const combinedItems = [
//           ...donationData.items.map((item) => ({ ...item, type: "Donation" })),
//           ...requestData.items.map((item) => ({ ...item, type: "Request" })),
//         ];
//         setItems(combinedItems);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchItems();
//   }, []);
//   return (
//     <div>
//       {items.map((item) => (
//         <MyCard key={item._id} item={item} /> // Use the Card component
//       ))}
//     </div>
//   );
// };

// components/MyDonationsRequests.js
const ActiveCardsList = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> My Active Cards List</h1>
    </div> 
  );
};

export default ActiveCardsList;


// export default ActiveCardsList;
