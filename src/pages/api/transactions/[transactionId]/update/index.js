import { TransactionModel } from "@/core/models/Transaction";
import connectToDB from "@/core/db/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();
      const transactionId = req.query.transactionId;
      const { status } = req.body;

      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        { status },
        { new: true }
      );

      res.status(200).json({ message: 'Update Transaction successfully' , data: { transaction: updatedTransaction}});
    } catch (err) {
      res.status(500).json({ message: "Failed to update transcation" });
    }
  }
}
