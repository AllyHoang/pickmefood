// API handler

import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";
import BasketModel from "@/core/models/Basket";
import { Status } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const { userId, items, image, description, title } = req.body;

    try {
      await connectToDB();

      // Create the items first
      const createdItems = await ItemModel.insertMany(items);

      // Extract the item IDs
      const itemIds = createdItems.map((item) => item._id);

      // Create the basket with the item IDs
        // This array should match the enum in the schema
      const basket = new BasketModel({
        userId,
        items: itemIds,
        image,
        title,
        description,
      });
      await basket.save();

      // Populate items field before sending response
      const populatedBasket = await BasketModel.findById(basket._id).populate(
        "items"
      );
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
      await connectToDB();
      const items = await ItemModel.find();
      res.status(200).json({ items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
