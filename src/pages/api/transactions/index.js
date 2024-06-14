import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";

export default async function handler(req, res) {

  if (req.method === "GET") {
    try {
    await connectToDB();
    // Retrieve all transactions in the database
    const allTransactions = await TransactionModel.find();
    res.status(201).json({ message: "All Transactions" , data: { transaction: allTransactions}});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}