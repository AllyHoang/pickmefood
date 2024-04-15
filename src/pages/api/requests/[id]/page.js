import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method === "DELETE") {
      const itemId = req.query.id;
      const deletedItem = await RequestModel.findByIdAndDelete(itemId);

      if (deletedItem) {
        res
          .status(200)
          .json({ message: "Item deleted", data: { item: deletedItem } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }

    } else if (req.method === "GET") {
      const itemId = req.query.id;
      const itemInfo = await RequestModel.findById(itemId);

      if (itemInfo) {
        res
          .status(200)
          .json({ message: "Item data fetched", data: { item: itemInfo } });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }

    } else if (req.method === "PUT") {
      const itemId = req.query.id;
      const updatedItemInfo = req.body;
      const updatedItem = await RequestModel.findByIdAndUpdate(
        itemId,
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
