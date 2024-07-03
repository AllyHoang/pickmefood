import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

export default async function handler(req, res) {
  await connectToDB();
  if (req.method === "GET") {
    const eventName = req.query.eventName;
    const event = await EventModel.find({ eventName });
    res.status(200).json({ event });
  } else {
    res.status(404).json({ message: "Event Not Found" });
  }
}
