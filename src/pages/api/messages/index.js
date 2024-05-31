import { pusherServer } from "@/lib/pusher";
import Chat from "@/core/models/Chat";
import Message from "@/core/models/Message";
import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();

      const { chatId, currentUserId, text, photo } = req.body;

      const currentUser = await UserModel.findById(currentUserId);

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const newMessage = await Message.create({
        chat: chatId,
        sender: currentUser,
        text,
        photo,
        seenBy: [currentUserId],
      });

      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: newMessage._id },
          $set: { lastMessageAt: newMessage.createdAt },
        },
        { new: true }
      )
        .populate({
          path: "messages",
          model: Message,
          populate: { path: "sender seenBy", model: "User" },
        })
        .populate({
          path: "members",
          model: "User",
        })
        .exec();

      /* Trigger a Pusher event for a specific chat about the new message */
      await pusherServer.trigger(chatId, "new-message", newMessage);

      /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
      const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
      updatedChat.members.forEach(async (member) => {
        try {
          await pusherServer.trigger(member._id.toString(), "update-chat", {
            id: chatId,
            messages: [lastMessage],
          });
        } catch (err) {
          console.error(
            `Failed to trigger update-chat event for member ${member._id}:`,
            err
          );
        }
      });

      return res.status(200).json(newMessage);
    } catch (err) {
      console.error("Failed to create new message:", err);
      return res.status(500).json({ message: "Failed to create new message" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
