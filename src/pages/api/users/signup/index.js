import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();

    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    // Create token data
    const tokenData = {
      id: newUser._id,
      email: newUser.email,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Set token as a cookie
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
    await newUser.save();
    return res.status(201).json({ message: "User created successfully." });
  }
}
