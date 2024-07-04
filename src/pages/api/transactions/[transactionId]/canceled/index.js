import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { TransactionModel } from "@/core/models/Transaction";
import { Status } from "@/lib/utils";
import { Knock } from "@knocklabs/node";

export default async function handler(req, res) {
  const { transactionId } = req.query;
  const knock = new Knock(
    process.env.KNOCK_SECRET_KEY
  );

  if (req.method === "PUT") {
    try {
      // Connect to the database
      await connectToDB();

      // Find the transaction
      const existingTransaction = await TransactionModel.findById(
        transactionId
      );

      if (!existingTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Update the agreeByDonor and agreeByRequester fields to false and status to 'canceled'
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        {
          $set: {
            agreedByDonor: false,
            agreedByRequester: false,
            status: Status.CANCELED,
          },
        },
        { new: true }
      );

      const { basketId, basketrequestId } = updatedTransaction;

      // Decrement the pendingTransactions and update status to INITIATED for the related basket
      await BasketModel.findByIdAndUpdate(basketId, {
        $inc: { pendingTransactions: -1 },
        status: Status.INITIATED,
      });

      // Decrement the pendingTransactions and update status to INITIATED for the related basket request
      await BasketRequest.findByIdAndUpdate(basketrequestId, {
        $inc: { pendingTransactions: -1 },
        status: Status.INITIATED,
      });

      // Trigger notification if the transaction is updated
      if (updatedTransaction) {
        console.log("hello");
        //Sending notification to both users
        try {
          await knock.workflows.trigger("donor-accept-bid", {
            actor: {
              id: updatedTransaction.requesterId._id,
              collection: "User",
            },
            recipients: [
              {
                id: updatedTransaction.donorId._id,
                email: updatedTransaction.donorId.email,
                // username: updatedTransaction.donorId.username,
              },
              {
                id: updatedTransaction.requesterId._id,
                email: updatedTransaction.requesterId.email,
                // username: updatedTransaction.requesterId.username,
              },
            ],
            data: {
              id: updatedTransaction._id,
              message: "❌ Your transaction has been canceled",
              type: "Cancellation"
            },
          });
          console.log("Knock notification sent!");
        } catch (error) {
          console.error("Error sending Knock notification:", error);
        }
      }

      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
