import { IvschatClient, CreateChatTokenCommand } from "@aws-sdk/client-ivschat";
import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";

const chatClient = new IvschatClient({ region: "us-east-1" });

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { userId, roomIdentifier } = req.body;

    try {
      // Fetch user data
      const user = await UserModel.findById(userId).exec();

      // Check if the user already has a chat token
      if (user && user.chatToken) {
        res.status(200).json({
          message: "Chat Token already exists",
          data: {
            chatToken: user.chatToken,
          },
        });
        return;
      }

      // Create Chat Token
      const chatTokenInput = {
        roomIdentifier: roomIdentifier, // Use the room ARN from the chat room response
        userId: userId, // Use the username as userId for the chat token
        capabilities: ["SEND_MESSAGE", "DELETE_MESSAGE"], // Capabilities for the token
        sessionDurationInMinutes: 60, // Token valid for 1 hour
        attributes: { userId }, // Optional attributes
      };

      const createChatTokenCommand = new CreateChatTokenCommand(chatTokenInput);
      const chatTokenResponse = await chatClient.send(createChatTokenCommand);

      const chatToken = chatTokenResponse.token;

      // Update user document with chat token
      await UserModel.findByIdAndUpdate(userId, {
        chatToken: chatToken,
      });

      res.status(200).json({
        message: "Token Created",
        data: {
          chatToken,
        },
      });
    } catch (error) {
      console.error("Error creating token:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
