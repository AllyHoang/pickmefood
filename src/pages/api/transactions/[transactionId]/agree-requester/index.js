import connectToDB from "@/core/db/mongodb";
import { TransactionModel } from "@/core/models/Transaction";
import { updateStatusIfAgreed } from "../..";
import { Knock } from "@knocklabs/node";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { Status } from "@/lib/utils";

export default async function handler(req, res) {
  const { transactionId } = req.query;
  const apikey = process.env.KNOCK_SECRET_KEY;
  const knock = new Knock(
    apikey
  );
  if(!apikey) console.log("api key does not exsit");

  if (req.method === "PUT") {
    try {
      // Connect to the database
      await connectToDB();

      // Find the transaction
      const existingTransaction = await TransactionModel.findById(
        transactionId
      );
      // console.log("existingTransaction: ",existingTransaction);

      if (!existingTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // console.log("existingTransaction.agreedByRequester: ", existingTransaction.agreedByRequester);
      // Update the agreedByDonor field
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        { $set: { agreedByRequester: true, status: Status.CONNECTED } },
        { new: true }
      ).populate("donorId requesterId");

      // Trigger notification if the transaction is updated
      if (updatedTransaction) {
        console.log("hello");
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
            ],
            data: {
              name: updatedTransaction.requesterId.username,
              id: updatedTransaction._id,
              message: "Accepted your transaction. You two are now connecting... Click to chat!",
              url:"transactions"
            },
          });
          console.log("Knock notification sent!");
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

      console.log("updatedTransaction: ", updatedTransaction);
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
