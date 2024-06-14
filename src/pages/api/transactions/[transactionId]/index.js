
import connectToDB from "@/core/db/mongodb";
import TransactionModel from "@/core/models/Transaction";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();

  if (method === 'GET') {
    try {
        const transactionId = req.query.transactionId;
        if (!transactionId) {
          return res.status(400).json({ message: "Missing transactionId parameter" });
        }
        await connectToDB();
        const transaction = await TransactionModel.find({ transactionId: transactionId });
        res.status(200).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}



