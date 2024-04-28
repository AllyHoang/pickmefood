import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();

    const email = req.body.email;
    const password = req.body.password;

    const User = await UserModel.findOne({
      email,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.password = hashedPassword;

    User.resetToken = undefined;
    User.resetTokenExpiry = undefined;

    try {
      await User.save();
      return res.status(200).json({ message: "User's password is updated." });
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
}
