import mongoose from "mongoose";
import EventModel from "@/core/models/Event"; // Update the path to your EventModel
import connectToDB from "@/core/db/mongodb";; // Update the path to your DB connection function

async function updateEvents() {
  try {
    await connectToDB();

    const result = await EventModel.updateMany(
      {}, // Match all documents
      {
        $set: { likes: [], comments: [] }, // Set likes and comments to empty arrays
      }
    );

    console.log(`Successfully updated ${result.nModified} events.`);
  } catch (error) {
    console.error("Error updating events:", error);
  } finally {
    mongoose.connection.close();
  }
}

export default updateEvents();
