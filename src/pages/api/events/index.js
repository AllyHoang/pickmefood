import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

export default async function handler(req, res) {
  if (req.method == "POST") {
    await connectToDB();
    const userId = req.body.userId;
    const eventName = req.body.eventName;
    const description = req.body.description;
    const money = req.body.money;
    const location = req.body.location;
    const image = req.body.image;
    const expirationDate = req.body.expirationDate;
    const organizationName = req.body.organizationName;
    const newEvent = new EventModel({
      userId,
      eventName,
      description,
      money,
      location,
      image,
      expirationDate,
      organizationName,
    });
    await newEvent.save();
    res.status(201).json({ message: "Event Created", data: { newEvent } });
  } else if (req.method == "GET") {
    await connectToDB();
    const events = await EventModel.find();
    res.status(200).json({ events });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
