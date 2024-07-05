const axios = require("axios");

const basketIds = [
  "667e32f090fd1a52f8e08276",
  "667e368954dcb819e6153773",
  "667e368d54dcb819e6153795",
  "667e32ef90fd1a52f8e08270",
  "667e368954dcb819e615377b",
  "667e32f190fd1a52f8e0827c",
  "667e368c54dcb819e615378d",
  "667e396426c0a5ef2c1314c2",
  "667e32ef90fd1a52f8e08268",
  "667e369054dcb819e61537b3",
  "667e32f290fd1a52f8e0828e",
  "667e368954dcb819e615377b",
  "667e396326c0a5ef2c1314b8",
  "667e3987a91b0944be291692",
  "667e4082009d1a033df2262e",
  "667e4085009d1a033df22654",
  "667e368e54dcb819e61537a1",
  "667e368f54dcb819e61537ab",
  "667e32f290fd1a52f8e08282",
];

// Define the endpoint URL (change if necessary)
const endpointURL = "http://localhost:3000/api/basketrequests"; // Replace with your actual endpoint URL

const deleteBaskets = async (basketIds) => {
  try {
    const response = await axios.delete(endpointURL, {
      data: { basketIds }, // Pass basket IDs in the request body
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Deletion results:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

// Execute the function
deleteBaskets(basketIds);
