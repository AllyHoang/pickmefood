import { IvsClient, CreateChannelCommand } from "@aws-sdk/client-ivs";
import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";

const client = new IvsClient({
  region: "us-east-1", // replace with your region
  // credentials are automatically picked from environment or shared credentials file
});

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { userId, username } = req.body;
    const input = {
      name: username,
      latencyMode: "LOW",
      type: "STANDARD",
      authorized: false,
    };

    const command = new CreateChannelCommand(input);

    try {
      const ivsResponse = await client.send(command);

      // Ensure the channel and streamKey data is properly extracted
      const channelData = {
        playbackUrl: ivsResponse.channel.playbackUrl,
        streamKey: ivsResponse.streamKey.value,
        ingestServer: ivsResponse.channel.ingestEndpoint,
      };

      await UserModel.findByIdAndUpdate(userId, {
        $set: { channel: channelData },
      });

      res.status(200).json({
        message: "Channel Created",
        data: { channelData },
      });
    } catch (error) {
      console.error("Error creating channel:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
