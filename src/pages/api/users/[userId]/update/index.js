import { UserModel } from "@/core/models/User";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();
    const userId = req.query.userId;
    const { firstName, lastName, username, profileImage, points} = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        profileImage,
        points,
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
