// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    await connectToDB();
    const newUser = await UserModel.create(req.body);
    res.status(201).json({ message: "User Created", data: { user: newUser } });
  } else if (req.method === "GET") {
    // Handle a GET request
    await connectToDB();
    const allUsers = await UserModel.find();
    res.status(200).json({ allUsers });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
