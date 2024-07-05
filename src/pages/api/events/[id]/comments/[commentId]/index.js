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
      case "PUT":
        // Handle PUT request to update a comment
        const { text: updatedText } = req.body;
        const eventIdToUpdateComment = req.query.id;
        const commentIdToUpdate = req.query.commentId;

        if (!updatedText) {
          return res.status(400).json({ message: "Updated text is required" });
        }

        try {
          const eventToUpdateComment = await EventModel.findOneAndUpdate(
            {
              _id: eventIdToUpdateComment,
              "comments._id": commentIdToUpdate,
            },
            {
              $set: { "comments.$.text": updatedText },
            },
            { new: true }
          );

          if (eventToUpdateComment) {
            res.status(200).json({
              message: "Comment updated",
              data: { event: eventToUpdateComment },
            });
          } else {
            res.status(404).json({ message: "Event or Comment Not Found" });
          }
        } catch (error) {
          res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
          });
        }
        break;
      case "DELETE":
        // Handle DELETE request to delete a comment
        const eventIdToDeleteComment = req.query.id;
        const commentIdToDelete = req.query.commentId;

        try {
          const eventToDeleteComment = await EventModel.findByIdAndUpdate(
            eventIdToDeleteComment,
            {
              $pull: { comments: { _id: commentIdToDelete } },
            },
            { new: true }
          );

          if (eventToDeleteComment) {
            res.status(200).json({
              message: "Comment deleted",
              data: { event: eventToDeleteComment },
            });
          } else {
            res.status(404).json({ message: "Event or Comment Not Found" });
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
