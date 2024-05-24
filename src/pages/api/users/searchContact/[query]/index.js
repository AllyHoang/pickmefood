import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();
      const query = req.query.query;
      const searchedContacts = await UserModel.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      });
      res.status(201).json({ searchedContacts });
    } catch (err) {
      res.status(500).json({ message: "Failed to search contact" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
