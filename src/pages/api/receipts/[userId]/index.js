import connectToDB from "@/core/db/mongodb";
import { ReceiptModel } from "@/core/models/Receipt";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle a GET request
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    await connectToDB();
    // Assuming there's a field in your ItemModel called 'userId'
    const receipts = await ReceiptModel.find({ userId: userId });
    res.status(200).json({ receipts });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
