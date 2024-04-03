import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await connectToDB();
    const itemId = req.query.id;
    const deletedItem = await ItemModel.findByIdAndDelete(itemId)
    if (deletedItem) {
      res.status(200).json({message: "Item deleted", data: {item: deletedItem}});
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  }
}
