import connectToDB from "@/core/db/mongodb";
import BasketRequest from "@/core/models/BasketRequest";
import RequestModel from "@/core/models/Request";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();

      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const baskets = await BasketRequest.find({ userId: userId }).lean();
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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
