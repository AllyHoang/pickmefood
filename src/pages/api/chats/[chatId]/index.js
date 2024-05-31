import Chat from "@/core/models/Chat";
import Message from "@/core/models/Message";
import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    await connectToDB();
    const chatId = req.query.chatId;
    const { currentUserId } = req.body;
    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: UserModel,
      })
      .exec();
    res.status(201).json({ message: "Seen all messages by current user" });
  } else if (req.method === "GET") {
    // Handle a GET request
    await connectToDB();
    const chatId = req.query.chatId;
    const chat = await Chat.findById(chatId)
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
    res.status(200).json({ chat });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
