// Next.js API route: /api/users
import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import Chat from "@/core/models/Chat";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const userId = req.query.userId; // Assuming userId is passed as a query parameter
      console.log(userId);

      // Find all chats where the userId is a member
      const chats = await Chat.find({ members: userId });

      // Extract unique user ids from the chats (excluding the current user)
      const otherUserIds = chats.reduce((acc, chat) => {
        chat.members.forEach((memberId) => {
          if (memberId !== userId && !acc.includes(memberId)) {
            acc.push(memberId);
          }
        });
        return acc;
      }, []);

      // Fetch user details for otherUserIds
      const usersInChats = await UserModel.find({ _id: { $in: otherUserIds } });

      res.status(200).json({ usersInChats });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
