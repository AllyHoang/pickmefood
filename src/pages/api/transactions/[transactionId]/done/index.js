import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";

import { Knock } from "@knocklabs/node";
import { POINTS, Status } from "@/lib/utils";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { UserModel } from "@/core/models/User";

export default async function handler(req, res) {
  const knock = new Knock(
    process.env.KNOCK_SECRET_KEY
  );
  const { transactionId } = req.query;
  console.log(knock);
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
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        { $set: { status: Status.ACCEPTED, matchedAt: Date.now(), agreedByDonor: true, agreedByRequester: true } },
        { new: true }
      ).populate("donorId requesterId");

      if (updatedTransaction) {
        console.log("final Transaction: ", updatedTransaction);
        //sending Notification to both Users
        try {
          await knock.workflows.trigger("donor-accept-bid", {
            actor: { id: updatedTransaction.donorId._id, collection: "User" },
            recipients: [
              {
                id: updatedTransaction.requesterId._id,
                email: updatedTransaction.requesterId.email,
                username: updatedTransaction.requesterId.username,
              },
              {
                id: updatedTransaction.donorId._id,
                email: updatedTransaction.donorId.email,
                username: updatedTransaction.donorId.username,           
              },
            ],
            data: {
              id: updatedTransaction._id,
              message:
                `✅ Your transaction is done! You earned total ${POINTS.TRANSACTION} points`,
              type: "Done",
            },
          });
        } catch (error) {
          console.error("Error sending Knock notification:", error);
        }

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
        await UserModel.findByIdAndUpdate(updatedTransaction.donorId, {
          $inc: { points: POINTS.TRANSACTION },
        });
        await UserModel.findByIdAndUpdate(updatedTransaction.requesterId, {
          $inc: { points: POINTS.TRANSACTION },
        });
  
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
