import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

export default async function handler(req, res) {
  await connectToDB();
  if (req.method === "GET") {
    const userId = req.query.userId;
    const events = await EventModel.find({ userId });
    res.status(200).json({ events });
  } else {
    res.status(404).json({ message: "Event Not Found" });
  }
}
