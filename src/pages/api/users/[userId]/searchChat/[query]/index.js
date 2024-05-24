import Chat from "@/core/models/Chat";
import Message from "@/core/models/Message";
import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();
      const userId = req.query.userId;
      const query = req.query.query;

      const searchedChat = await Chat.find({
        members: userId,
        name: { $regex: query, $options: "i" },
      })
        .populate({
          path: "members",
          model: UserModel,
        })
        .populate({
          path: "messages",
          model: Message,
          populate: {
            path: "sender seenBy",
            model: UserModel,
          },
        })
        .exec();
      res.status(201).json({ searchedChat });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to search chat" });
    }
  }
}
