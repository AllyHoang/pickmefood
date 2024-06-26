import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();

  if (method === 'GET') {
    try {
        const transactionId = req.query.transactionId;
        if (!transactionId) {
          return res.status(400).json({ message: "Missing transactionId parameter" });
        }

        // Query the transaction and populate related user, basket, and request basket
        const transaction = await TransactionModel.findOne({ _id: transactionId })
          .populate('requesterId')
          .populate('basketrequestId')
          .populate('donorId')
          .populate('basketId');
        if (!transaction) {
          return res.status(404).json({ message: "Transaction not found" });
        }
        
        res.status(200).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
