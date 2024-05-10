// Pseudocode for creating a new user in the database

import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDB();

    const email = req.body.email;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully." });
  }
}