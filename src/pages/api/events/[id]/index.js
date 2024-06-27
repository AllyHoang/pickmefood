import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";
import jwt from "jsonwebtoken"; // Import jsonwebtoken library
import updateEvent from "../../../../../updateEvent";

export default async function handler(req, res) {
  // console.log(req.method)
  try {
    // Perform server-side operations, such as connecting to the database
    await connectToDB();

    // Decode the token to get user information
    const token = req.cookies.token; // Assuming token is passed in cookies
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken || !decodedToken.id) {
      // If token is invalid or userId is not present, return unauthorized
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch item data based on the request method
    if (req.method === "DELETE") {
      // Handle DELETE request
      const eventId = req.query.id;
      const deletedEvent = await EventModel.findOneAndDelete({
        _id: eventId,
        userId: decodedToken.id, // Filter by userId
      });

      if (deletedEvent) {
        res
          .status(200)
          .json({ message: "Event deleted", data: { event: deletedEvent } });
      } else {
        res.status(404).json({ message: "Event Not Found" });
      }
    } else if (req.method === "GET") {
      const eventId = req.query.id;
      const eventInfo = await EventModel.findById(eventId);

      if (eventInfo) {
        res
          .status(200)
          .json({ message: "Event data fetched", data: { event: eventInfo } });
      } else {
        res.status(404).json({ message: "Event Not Found" });
      }
    } else if (req.method === "PUT") {
      console.log("INSIDE PUT METHOD")
      const eventId = req.query.id;
      const updatedEventInfo = req.body;
      const updatedEvent = await EventModel.findOneAndUpdate(
        { _id: eventId }, // Filter by userId
        updatedEventInfo,
        // { new: true }
      );
      console.log(updatedEventInfo)
      console.log(updatedEvent)

      if (updatedEvent) {
        res
          .status(200)
          .json({ message: "Event updated", data: { event: updatedEvent } });
      } else {
        res.status(404).json({ message: "Event Not Found" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
