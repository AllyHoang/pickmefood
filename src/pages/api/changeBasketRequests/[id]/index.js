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
      const baskets = await BasketRequest.find().populate("userId").lean();
      //Fetch full item infor for each basket
      const populatedBaskets = await Promise.all(
        baskets.map(async (basket) => {
          const items = await RequestModel.find({
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
      if (!basketId) {
        return res.status(400).json({ message: "Basket ID is required" });
      }

      const basket = await BasketRequest.findById(basketId).lean();

      if (!basket) {
        return res.status(404).json({ message: "Basket not found" });
      }

      // Delete all items in the basket
      await RequestModel.deleteMany({ _id: { $in: basket.items } });

      // Delete the basket
      await BasketRequest.findByIdAndDelete(basketId);

      res
        .status(200)
        .json({ message: "Basket and items deleted successfully" });
    } catch (error) {
      console.error("Error deleting basket and items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
