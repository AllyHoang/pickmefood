import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";
import jwt from "jsonwebtoken"; // Import jsonwebtoken library

export default async function handler(req, res) {
  try {
    // Perform server-side operations, such as connecting to the database
    await connectToDB();

    // Decode the token to get user information
    const token = req.cookies.token; // Assuming token is passed in cookies
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken || !decodedToken.id) {
      // If token is invalid or userId is not present, return unauthorized
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch item data based on the request method
    if (req.method === "DELETE") {
      // Handle DELETE request
      const itemId = req.query.id;
      const deletedItem = await ItemModel.findOneAndDelete({
        _id: itemId,
        userId: decodedToken.id, // Filter by userId
      });

      if (deletedItem) {
        res
          .status(200)
          .json({ message: "Item deleted", data: { item: deletedItem } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    } else if (req.method === "GET") {
      const itemId = req.query.id;
      const itemInfo = await ItemModel.findById(itemId);

      if (itemInfo) {
        res
          .status(200)
          .json({ message: "Item data fetched", data: { item: itemInfo } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    } else if (req.method === "PUT") {
      // Handle PUT request
      const itemId = req.query.id;
      const updatedItemInfo = req.body;
      const updatedItem = await ItemModel.findOneAndUpdate(
        { _id: itemId, userId: decodedToken.id }, // Filter by userId
        updatedItemInfo,
        { new: true }
      );

      if (updatedItem) {
        res
          .status(200)
          .json({ message: "Item updated", data: { item: updatedItem } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
