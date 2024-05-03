// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    await connectToDB();
    const newItem = await ItemModel.create(req.body);
    res.status(201).json({ message: "Item Created", data: { item: newItem } });
  } else if (req.method === "GET") {
    // Handle a GET request
    await connectToDB();
    const items = await ItemModel.find();
    res.status(200).json({ items });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
