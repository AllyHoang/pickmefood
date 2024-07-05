import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

export default async function handler(req, res) {
  try {
    // Perform server-side operations, such as connecting to the database
    await connectToDB();

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        // Handle GET request to get all comments of an event
        const eventIdToFetch = req.query.id;

        try {
          const event = await EventModel.findById(eventIdToFetch);

          if (!event) {
            return res.status(404).json({ message: "Event Not Found" });
          }

          const { comments } = event;
          res.status(200).json({
            message: "Comments fetched",
            data: { comments },
          });
        } catch (error) {
          res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
          });
        }
        break;
      case "POST":
        // Handle POST request to add a comment
        const { userId, text } = req.body;
        const eventIdToAddComment = req.query.id;

        if (!text) {
          return res.status(400).json({ message: "Comment text is required" });
        }

        const newComment = {
          user: userId, // Assuming userId is passed in req.body
          text: text,
          createdAt: new Date(),
        };

        try {
          const eventToUpdate = await EventModel.findByIdAndUpdate(
            eventIdToAddComment,
            {
              $push: { comments: newComment },
            },
            { new: true }
          );

          if (eventToUpdate) {
            res.status(200).json({
              message: "Comment added to event",
              data: { event: eventToUpdate },
            });
          } else {
            res.status(404).json({ message: "Event Not Found" });
          }
        } catch (error) {
          res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
          });
        }
        break;
      default:
        res.status(405).json({ message: "Method Not Allowed" });
        break;
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
