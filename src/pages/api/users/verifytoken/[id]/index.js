import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();
    const id = req.query.id;
    const hashedToken = crypto.createHash("sha256").update(id).digest("hex");

    const User = await UserModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!User) {
      return res.status(400).json({ error: "Invalid Token or has expired" });
    }
    const email = User.email;
    return res.status(200).json({ email });
  }
}
