import Chat from "@/core/models/Chat";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();
      const chatId = req.query.chatId;
      const { name, groupPhoto } = req.body;

      const updatedGroupChat = await Chat.findByIdAndUpdate(
        chatId,
        { name, groupPhoto },
        { new: true }
      );

      res.status(200).json({ updatedGroupChat });
    } catch (err) {
      res.status(500).json({ message: "Failed to update group chat info" });
    }
  }
}
