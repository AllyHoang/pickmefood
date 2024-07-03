// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDB from "@/core/db/mongodb";
import PlacesModel from "@/core/models/Places";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    await connectToDB();
    const newItem = await PlacesModel.create(req.body);
    res.status(201).json({ message: "Item Created", data: { item: newItem } });
  } else if (req.method === "GET") {
    // Handle a GET request
    await connectToDB();
    const places = await PlacesModel.find();
    res.status(200).json({ places });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
