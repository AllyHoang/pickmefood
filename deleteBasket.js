const axios = require("axios");

// Define the basket IDs to delete
const basketIds = [
  "667cdf01ff945395d369ac2c",
  "667ce198be121aa8123b01f1",
  "667cdcf4ff945395d369aae1",
];

// Define the endpoint URL (change if necessary)
const endpointURL = "http://localhost:3000/api/baskets"; // Replace with your actual endpoint URL

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
