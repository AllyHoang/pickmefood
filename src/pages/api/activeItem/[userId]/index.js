import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    await connectToDB();
    const location = req.body.userAddress;
    const userId = req.body.userId;
    const itemName = req.body.itemName;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const expirationDate = req.body.expirationDate;
    const newItem = new ItemModel({
      userId,
      itemName,
      description,
      quantity,
      expirationDate,
      location,
    });
    await newItem.save();
    res.status(201).json({ message: "Item Created", data: { item: newItem } });
  } else if (req.method === "GET") {
    // Handle a GET request
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    await connectToDB();
    // Assuming there's a field in your ItemModel called 'userId'
    const items = await ItemModel.find({ userId: userId });
    res.status(200).json({ items });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
