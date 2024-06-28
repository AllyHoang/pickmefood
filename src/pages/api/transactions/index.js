import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { TransactionModel } from "@/core/models/Transaction";
import { UserModel } from "@/core/models/User";
import { POINTS, Status } from "@/lib/utils";

//return all the transactions
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();
      // Retrieve all transactions in the database
      const allTransactions = await TransactionModel.find()
        .populate("requesterId")
        .populate("basketrequestId")
        .populate("donorId")
        .populate("basketId");
      res.status(201).json({ transaction: allTransactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Helper function to update status if conditions are met
export async function updateStatusIfAgreed(transaction) {
  // Check conditions directly on the passed transaction object
  if (transaction.agreedByDonor && transaction.agreedByRequester) {
    // Update transaction status to ACCEPTED
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      transaction._id,
      { status: Status.ACCEPTED, matchedAt: Date.now() },
      { new: true }
    );

    if (updatedTransaction) {
      console.log("final Transaction: ", updatedTransaction);

      // Update the status field in the basketId field from BasketModel
      await BasketModel.findByIdAndUpdate(updatedTransaction.basketId, {
        status: Status.ACCEPTED,
      });

      // Update the status field in the basketRequestId field from BasketRequest Model
      await BasketRequest.findByIdAndUpdate(
        updatedTransaction.basketrequestId,
        {
          status: Status.ACCEPTED,
        }
      );
      //Update Donor and Requester Points
       await UserModel.findByIdAndUpdate(updatedTransaction.donorId, { $inc: { points: POINTS.TRANSACTION } });
       await UserModel.findByIdAndUpdate(updatedTransaction.requesterId, { $inc: { points: POINTS.TRANSACTION } });
    }

    return updatedTransaction;
  }
  return transaction;
}
