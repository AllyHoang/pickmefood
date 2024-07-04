import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";
import { updateStatusIfAgreed } from "../..";

import { Knock } from "@knocklabs/node";
import { Status } from "@/lib/utils";
import BasketRequest from "@/core/models/BasketRequest";
import BasketModel from "@/core/models/Basket";

export default async function handler(req, res) {
  const apikey = process.env.KNOCK_SECRET_KEY;
  const knock = new Knock(
    apikey
  );
  if(!apikey) console.log("api key does not exsit");
  const { transactionId } = req.query;
  if (req.method === "PUT") {
    try {
      // Connect to the database
      await connectToDB();

      // Find the transaction
      const existingTransaction = await TransactionModel.findById(
        transactionId
      );
      // console.log("existingTransaction: ", existingTransaction);

      if (!existingTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

 
      // Update the agreedByDonor field
      // Update the agreedByDonor field
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        { $set: { agreedByDonor: true, status: Status.CONNECTED } },
        { new: true }
      ).populate("donorId requesterId");

      if (updatedTransaction) {
        console.log("hello");
        try {
          await knock.workflows.trigger("donor-accept-bid", {
            actor: { id: updatedTransaction.donorId._id, collection: "User" },
            recipients: [
              {
                id: updatedTransaction.requesterId._id,
                email: updatedTransaction.requesterId.email,
                // username: updatedTransaction.requesterId.username,
              },
            ],
            data: {
              name: updatedTransaction.donorId.username,
              id: updatedTransaction._id,
              message: "Accepted your transaction. You two are now connecting... Click to chat!",
              url: "transactions"
            },
          });
        } catch (error) {
          console.error("Error sending Knock notification:", error);
        }
      }

        // Update the status field in the basketId field from BasketModel
        await BasketModel.findByIdAndUpdate(updatedTransaction.basketId, {
          status: Status.CONNECTED,
        });

        // Update the status field in the basketRequestId field from BasketRequest Model
        await BasketRequest.findByIdAndUpdate(
          updatedTransaction.basketrequestId,
          {
            status: Status.CONNECTED,
          }
        );
      // console.log("updatedTransaction: ", updatedTransaction);
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
