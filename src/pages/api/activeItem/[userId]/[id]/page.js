import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method === "DELETE") {
      const userId = req.query.userId;
      const itemId = req.query.id;

      // Check if both itemId and userId are provided
      if (!itemId || !userId) {
        return res
          .status(400)
          .json({ message: "Both itemId and userId are required" });
      }

      // Find and delete item by both itemId and userId
      const deletedItem = await ItemModel.findOneAndDelete({
        _id: itemId,
        userId: userId,
      });

      if (deletedItem) {
        res
          .status(200)
          .json({ message: "Item deleted", data: { item: deletedItem } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    } else if (req.method === "PUT") {
      const userId = req.query.userId;
      const itemId = req.query.id;
      const updatedItemInfo = req.body;

      // Check if both itemId and userId are provided
      if (!itemId || !userId) {
        return res
          .status(400)
          .json({ message: "Both itemId and userId are required" });
      }

      // Find and update item by both itemId and userId
      const updatedItem = await ItemModel.findOneAndUpdate(
        { _id: itemId, userId: userId },
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
    } else if (req.method === "GET") {
      // Handle GET request
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
