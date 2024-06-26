import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";

// Get transactions for a specific user (either as donor or requester)
export default async function handler(req, res) {
  const { userId } = req.query; 

  if (req.method === "GET") {
    try {
      await connectToDB();

      // Retrieve transactions where the user is either the donor or the requester
      const userTransactions = await TransactionModel.find({
        $or: [
          { donorId: userId },
          { requesterId: userId }
        ]
      })
      .populate({
        path: 'requesterId'
      })
      .populate({
        path: 'donorId'
      })
      .populate({
        path: 'basketId',
        populate: {
          path: 'items'  // Assuming the items are stored in the 'items' field within 'basketId'
        }
      })
      .populate({
        path: 'basketrequestId',
        populate: {
          path: 'requests'  // Assuming the requests are stored in the 'requests' field within 'basketrequestId'
        }
      });

      res.status(200).json({ transactions: userTransactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}