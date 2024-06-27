const axios = require("axios");

// Base URL for the API
const baseURL = "http://localhost:3000/api/baskets"; // Change as needed

const deleteBaskets = async (basketIds) => {
  try {
    const response = await axios.delete(baseURL, {
      data: { basketIds }, // Payload containing basket IDs
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Deletion results:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

// Example basket IDs to delete
const basketIds = [
  "666a7aa190b19bb3cbe2ecff",
  "666c77341d128fcdc5f705fd",
  "666ddeedd97145ec2ef601da",
  "666e86fed97145ec2ef60295",
  "666e8b6cb12f3cecf5e89127",
  "666e8d43b12f3cecf5e89157",
  "6670bf8730049ec0a844bbd2",
  "6670c08b30049ec0a844bbf8",
  "6670c18db62503e6ee2d436a",
  "6670f4bab62503e6ee2d45ec",
  "6670f5b5b62503e6ee2d46ca",
  "6670f666b62503e6ee2d47ab",
  "6670f8e4b62503e6ee2d4a61",
  "6670f9e2b62503e6ee2d4b48",
  "6670fb38b62503e6ee2d4cda",
  "6670fb3ab62503e6ee2d4ce0",
  "6670fd17b62503e6ee2d4dd0",
  "6670fd17b62503e6ee2d4dd6",
  "6670fde9bd04523cfe750db2",
  "6670ff7e202b10fc28c0a48d",
  "66710355e107ac00e1bb78d5",
  "66710356e107ac00e1bb78db",
  "6671c881ba76e495070fb175",
  "6671cba284e2cd6822cca499",
  "6671d55d8bdf726121406926",
  "66727dd83bb4251dc7f5cdcf",
  "66727ebc3bb4251dc7f5ce8f",
  "6673ac6c85675caf1c741791",
  "6673b07f85675caf1c741ed7",
  "6673b24685675caf1c7422dd",
  "6673b3b41509d0080d52dff3",
  "6673b4091509d0080d52e0ba",
  "6673b4581509d0080d52e183",
  "6673b4971509d0080d52e24d",
  "6673b4f91509d0080d52e319",
  "6673b5431509d0080d52e3e7",
  "6673b5901509d0080d52e4b8",
  "66758db0b9b4788aaff28218",
  "66760b5ae20c35468a12aa1c",
  "66761023de0da8245b630b2a",
  "667729c30bd19874b74cb448",
  "667a5c826775d01434602efb",
  "667b7859f6ae234e1d0f7aef",
  "667b78ecf6ae234e1d0f7c04",
  "667b79a3bb3a327c6d28a201",
  "667b8bf81ded2895d3fe49e1",
];

deleteBaskets(basketIds);
