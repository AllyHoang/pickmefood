import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";
import BasketRequest from "@/core/models/BasketRequest";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    console.log(req.body);
    const { userId, requests, image } = req.body;

    try {
      await connectToDB();

      // Create the items first
      const createdRequests = await RequestModel.insertMany(requests);

      // Extract the item IDs
      const requestIds = createdRequests.map((item) => item._id);

      // Create the basket with the item IDs
      const basket = new BasketRequest({
        userId,
        requests: requestIds,
        image,
      });

      await basket.save();

      // Populate items field before sending response
      const populatedBasket = await BasketRequest.findById(basket._id).populate(
        "requests"
      );

      res
        .status(201)
        .json({ message: "Basket Created", data: { basket: populatedBasket } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method == "GET") {
    await connectToDB();
    const requests = await RequestModel.find();
    res.status(200).json({ requests });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
