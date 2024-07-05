// pages/api/events/[eventId]/like.js

import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

export default async function handler(req, res) {
  await connectToDB();

  const { id } = req.query;
  const { userId } = req.body;

  try {
    if (req.method === "GET") {
      // Fetch the event by its ID
      const event = await EventModel.findById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json({ event });
    } else if (req.method === "POST") {
      // Find the event by its ID
      const event = await EventModel.findById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the user has already liked the event
      const likedIndex = event.likedBy.findIndex(
        (like) => String(like.user) === userId
      );

      // Toggle the like state or add if not present
      if (likedIndex === -1) {
        const newLike = {
          user: userId, // Assuming userId is passed in req.body
          state: true,
        };

        // User is not in likedBy array, add a new entry
        const eventToUpdate = await EventModel.findByIdAndUpdate(
          id,
          {
            $push: { likedBy: newLike },
          },
          { new: true }
        );
        if (eventToUpdate) {
          res.status(200).json({
            message: "Like added to event",
            data: { event: eventToUpdate },
          });
        } else {
          res.status(404).json({ message: "Event Not Found" });
        }
      } else {
        // User is already in likedBy array, toggle the state
        event.likedBy[likedIndex].state = !event.likedBy[likedIndex].state;
      }

      // Save the updated event
      const updatedEvent = await event.save();

      res.status(200).json({ message: "Event liked", event: updatedEvent });
    }
  } catch (error) {
    console.error("Error liking event:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
