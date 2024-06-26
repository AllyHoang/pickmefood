import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";
import { updateStatusIfAgreed } from "../..";

export default async function handler(req, res) {
    const { transactionId } = req.query;
  
    if (req.method === 'PUT') {
      try {
        // Connect to the database
        await connectToDB();
  
        // Find the transaction
        const existingTransaction = await TransactionModel.findById(transactionId);
        console.log("existingTransaction: ",existingTransaction);
  
        if (!existingTransaction) {
          return res.status(404).json({ message: 'Transaction not found' });
        }
  
        // Check if agreedByDonor is already true
        if (existingTransaction.agreedByRequester) {
          return res.status(200).json(existingTransaction);
        }
        console.log("existingTransaction.agreedByRequester: ", existingTransaction.agreedByRequester);
        // Update the agreedByDonor field
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
          transactionId,
          { $set: { agreedByRequester: true } },
          { new: true }
        );
  
        // Check if status needs to be updated
        const transactions = await updateStatusIfAgreed(updatedTransaction);
        console.log("updatedTransaction: ", updatedTransaction);
        res.status(200).json(transactions);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }