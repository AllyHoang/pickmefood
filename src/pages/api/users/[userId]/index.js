import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import Chat from "@/core/models/Chat";
import Message from "@/core/models/Message";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToDB();
    const userId = req.query.userId;
    const user = await UserModel.findById(userId);

    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
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

    if (user) {
      res.status(200).json({ user, allChats });
    } else {
      console.log(err);
      res.status(404).json({ message: "User Not Found" });
    }
  }
}
