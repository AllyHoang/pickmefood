import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();
    const email = req.body.email;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }

    const password = req.body.password;
    const hashedPassword = user.password;
    const matched = await bcrypt.compare(password, hashedPassword);
    if (!matched) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Set token as a cookie
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
    // Send the response to the client
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
