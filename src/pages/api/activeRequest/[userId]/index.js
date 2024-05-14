import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";

export default async function handler(req, res) {
  if (req.method == "POST") {
    await connectToDB();
    const newRequest = await RequestModel.create(req.body);
    res
      .status(201)
      .json({ message: "Request Created", data: { request: newRequest } });
  } else if (req.method == "GET") {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    await connectToDB();
    const requests = await RequestModel.find({ userId: userId });
    res.status(200).json({ requests });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
