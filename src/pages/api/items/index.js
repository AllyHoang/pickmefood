import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";
import BasketModel from "@/core/models/Basket";
import { UserModel } from "@/core/models/User";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    // Process a POST request
    const { userId, items, image, description, title, location, points } =
      req.body;

    try {
      // Create the items first
      const createdItems = await ItemModel.insertMany(items);

      // Extract the item IDs
      const itemIds = createdItems.map((item) => item._id);

      // Create the basket with the item IDs
      const basket = new BasketModel({
        userId,
        items: itemIds,
        image,
        title,
        description,
        location,
      });
      await basket.save();

      // Populate items field before sending response
      const populatedBasket = await BasketModel.findById(basket._id).populate(
        "items"
      );
      // Update user's points
      await UserModel.findByIdAndUpdate(userId, { $inc: { points: points } });

      res
        .status(201)
        .json({ message: "Basket Created", data: { basket: populatedBasket } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    // Handle a GET request
    try {
      const items = await ItemModel.find();
      res.status(200).json({ items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Handle a DELETE request
    try {
      const { idsToRetain } = req.body;

      if (!idsToRetain || !Array.isArray(idsToRetain)) {
        return res
          .status(400)
          .json({ message: "idsToRetain must be an array of item IDs" });
      }

      // Delete items not in the idsToRetain array
      const deleteResult = await ItemModel.deleteMany({
        _id: { $nin: idsToRetain },
      });

      // Also update baskets to remove references to deleted items
      await BasketModel.updateMany(
        { items: { $nin: idsToRetain } },
        { $pull: { items: { $nin: idsToRetain } } }
      );

      res.status(200).json({
        message: "Items and their references deleted successfully",
        deletedCount: deleteResult.deletedCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
