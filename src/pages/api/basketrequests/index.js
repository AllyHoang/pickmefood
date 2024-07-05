import connectToDB from "@/core/db/mongodb";
import BasketRequest from "@/core/models/BasketRequest";
import RequestModel from "@/core/models/Request";
import BasketModel from "@/core/models/Basket"; // Assuming you have this model
import ItemModel from "@/core/models/Item"; // Assuming you have this model

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();
      const baskets = await BasketRequest.find().populate("userId").lean();

      // Fetch full item information for each basket
      const populatedBaskets = await Promise.all(
        baskets.map(async (basket) => {
          const requests = await RequestModel.find({
            _id: { $in: basket.requests },
          }).lean();
          return {
            ...basket,
            requests,
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
          const basket = await BasketRequest.findById(basketId).lean();

          if (!basket) {
            return { basketId, status: "not found" };
          }

          // Delete all items in the basket
          await RequestModel.deleteMany({ _id: { $in: basket.items } });

          // Delete the basket
          await BasketRequest.findByIdAndDelete(basketId);

          return { basketId, status: "deleted" };
        })
      );

      res.status(200).json({
        message: "Baskets processed",
        results: deleteResults,
      });
    } catch (error) {
      console.error("Error deleting baskets:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
