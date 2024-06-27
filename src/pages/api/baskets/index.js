import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import ItemModel from "@/core/models/Item";

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
      const { basketIds } = req.body;

      if (!Array.isArray(basketIds) || basketIds.length === 0) {
        return res
          .status(400)
          .json({ message: "Array of basket IDs is required" });
      }

      const deleteResults = await Promise.all(
        basketIds.map(async (basketId) => {
          const basket = await BasketModel.findById(basketId).lean();

          if (!basket) {
            return { basketId, status: "not found" };
          }

          // Delete all items in the basket
          await ItemModel.deleteMany({ _id: { $in: basket.items } });

          // Delete the basket
          await BasketModel.findByIdAndDelete(basketId);

          return { basketId, status: "deleted" };
        })
      );

      res.status(200).json({
        message: "Baskets processed",
        results: deleteResults,
      });
    } catch (error) {
      console.error("Error deleting basket and items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
