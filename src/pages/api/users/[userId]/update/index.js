import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();
    const userId = req.query.userId;
    const { username, profileImage } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "User Updated", data: { user: updatedUser } });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
