import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import Chat from "@/core/models/Chat";
import Message from "@/core/models/Message";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const name = req.query.username;
      console.log("inside", name);
      const user = await UserModel.findOne({ username: name });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //   console.log("inside2", user)
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
