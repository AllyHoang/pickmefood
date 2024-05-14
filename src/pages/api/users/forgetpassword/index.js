import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();
      const email = req.body.email;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Email not registered" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const passwordResetExpires = Date.now() + 3600000;

      user.resetToken = passwordResetToken;
      user.resetTokenExpiry = passwordResetExpires;

      const resetUrl = `localhost:3000/reset-password/${resetToken}`;
      console.log(resetUrl);

      const body =
        "One more step to get your password reset woohoo!!! (Click on link 😉) \n" +
        resetUrl;
      const msg = {
        to: email,
        from: "vtmpteam2@gmail.com",
        subject: "Let's reset your password!",
        text: body,
      };

      sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
      await sgMail.send(msg);

      await user.save();

      return res
        .status(200)
        .json({ message: "Email is sent for resetting password" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
