import { IvsClient, CreateChannelCommand } from "@aws-sdk/client-ivs";
import { IvschatClient, CreateRoomCommand } from "@aws-sdk/client-ivschat";
import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

// Initialize IVS clients
const ivsClient = new IvsClient({
  region: "us-east-1",
  // credentials are automatically picked from environment or shared credentials file
});
const chatClient = new IvschatClient({ region: "us-east-1" });

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { eventName, eventId } = req.body;

    try {
      // Fetch event data
      const event = await EventModel.findById(eventId).exec();
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if channel and chatRoom already exist
      const channelExists = event.channel && event.channel[0];
      const chatRoomExists = event.chatRoom && event.chatRoom[0];

      if (channelExists && chatRoomExists) {
        res.status(200).json({
          message: "Channel and Chat Room already exist",
          data: {
            channelData: event.channel[0],
            chatData: event.chatRoom[0],
          },
        });
        return;
      }

      // Create IVS Channel
      const channelInput = {
        name: eventName,
        latencyMode: "LOW",
        type: "STANDARD",
        authorized: false,
      };

      const createChannelCommand = new CreateChannelCommand(channelInput);
      const ivsResponse = await ivsClient.send(createChannelCommand);

      if (!ivsResponse || !ivsResponse.channel || !ivsResponse.streamKey) {
        throw new Error("IVS channel creation failed");
      }

      const channelData = {
        playbackUrl: ivsResponse.channel.playbackUrl,
        streamKey: ivsResponse.streamKey.value,
        ingestServer: ivsResponse.channel.ingestEndpoint,
      };

      // Create IVS Chat Room
      const chatInput = {
        name: eventName,
        maximumMessageRatePerSecond: 10,
        maximumMessageLength: 500,
        // Optional: configure message review handler, tags, etc.
      };

      const createRoomCommand = new CreateRoomCommand(chatInput);
      const chatResponse = await chatClient.send(createRoomCommand);

      if (!chatResponse || !chatResponse.arn) {
        throw new Error("Chat room creation failed");
      }

      const chatData = {
        roomIdentifier: chatResponse.arn,
      };

      // Update event document with channel and chat data
      await EventModel.findByIdAndUpdate(eventId, {
        $set: {
          channel: [channelData], // Wrap in an array
          chatRoom: [chatData], // Wrap in an array
        },
      });

      res.status(200).json({
        message: "Channel and Chat Room Created",
        data: {
          channelData,
          chatData,
        },
      });
    } catch (error) {
      console.error("Error creating channel or chat room:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
