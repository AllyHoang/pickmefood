import { pusherServer } from "@/lib/pusher";
import Chat from "@/core/models/Chat";
import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();

      const { currentUserId, members, isGroup, name, groupPhoto } = JSON.parse(
        req.body
      );

      if (!Array.isArray(members)) {
        return res.status(400).json({ message: "Members should be an array" });
      }

      // Add currentUserId to members array for group chats
      const updatedMembers = isGroup ? [...members, currentUserId] : members;

      let chat;

      if (isGroup) {
        chat = await Chat.findOneAndUpdate(
          { isGroup, name, groupPhoto, members: updatedMembers },
          { $setOnInsert: { members: updatedMembers } }, // Ensure updatedMembers are set on insert
          { upsert: true, new: true }
        );
      } else {
        // Find or create a one-on-one chat
        const otherMember = members.find(
          (memberId) => memberId !== currentUserId
        );
        const otherMemberName = await UserModel.findById(otherMember).select(
          "username"
        );

        chat = await Chat.findOne({
          isGroup: false,
          members: {
            $all: [
              new mongoose.Types.ObjectId(currentUserId),
              new mongoose.Types.ObjectId(otherMember),
            ],
          },
        });

        console.log(chat);

        if (!chat) {
          chat = new Chat({
            members: [currentUserId, otherMember],
            name: otherMemberName.username,
          });

          await chat.save();
        }
      }

      // Update the chats array for all members
      const updateAllMembers = updatedMembers.map(async (memberId) => {
        await UserModel.findByIdAndUpdate(
          memberId,
          { $addToSet: { chats: chat._id } },
          { new: true }
        );
      });
      await Promise.all(updateAllMembers);

      // Trigger a new-chat event for all members
      updatedMembers.forEach(async (member) => {
        await pusherServer.trigger(member.toString(), "new-chat", chat);
      });

      res.status(201).json({ chat });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create a new chat" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
