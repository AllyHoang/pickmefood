import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import ItemModel from "@/core/models/Item";
import RequestModel from "@/core/models/Request";
import { Console } from "console";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();
      // Fetch all baskets and populate the user information as well as items
      const baskets = await BasketModel.find().populate("userId").lean();
      //Fetch full item infor for each basket
      const populatedBaskets = await Promise.all(
        baskets.map(async (basket) => {
          const items = await ItemModel.find({
            _id: { $in: basket.items },
          }).lean();
          return {
            ...basket,
            items,
          };
        })
      );

      res.status(200).json({ baskets: populatedBaskets });
    } catch (error) {
      console.error("Error fetching baskets:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDB();
      const basketId = req.query.id;
      console.log(basketId);
      if (!basketId) {
        return res.status(400).json({ message: "Basket ID is required" });
      }

      const basket = await BasketModel.findById(basketId).lean();

      if (!basket) {
        return res.status(404).json({ message: "Basket not found" });
      }

      // Delete all items in the basket
      await ItemModel.deleteMany({ _id: { $in: basket.items } });

      // Delete the basket
      await BasketModel.findByIdAndDelete(basketId);

      res
        .status(200)
        .json({ message: "Basket and items deleted successfully" });
    } catch (error) {
      console.error("Error deleting basket and items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectToDB();
      const basketId = req.query.id;
      if (!basketId) {
        return res.status(400).json({ message: "Basket ID is required" });
      }
      const updatedBasketInfo = req.body;
      const { items, ...basketFields } = updatedBasketInfo;
      // Update the basket fields
      const updatedBasket = await BasketModel.findOneAndUpdate(
        { _id: basketId },
        basketFields,
        { new: true }
      );

      if (items && items.length > 0) {
        // Validate and update each item
        for (const item of items) {
          if (item._id) {
            // If item exists, update it
            await ItemModel.findByIdAndUpdate(item._id, item);
          } else {
            // If item does not exist, create a new one and add it to the basket
            const newItem = new ItemModel(item);
            await newItem.save();
            updatedBasket.items.push(newItem._id);
          }
        }
        await updatedBasket.save();
      }

      if (updatedBasket) {
        res.status(200).json({
          message: "Basket updated successfully",
          data: { basket: updatedBasket },
        });
      } else {
        res.status(404).json({ message: "Basket not found" });
      }
    } catch (error) {
      console.error("Error editing basket and items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
