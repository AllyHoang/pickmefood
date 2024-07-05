import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { TransactionModel } from "@/core/models/Transaction";
import { Status } from "@/lib/utils";
import { Knock } from "@knocklabs/node";

export default async function handler(req, res) {
  const { method } = req;
  const knock = new Knock(
    process.env.KNOCK_SECRET_KEY
  );

  await connectToDB();

  if (method === "POST") {
    try {
      const {
        userId,
        basketrequestId,
        otherUserId,
        basketId,
        description,
        title,
        image,
        items,
        location,
      } = req.body;

      const existingTransaction = await TransactionModel.findOne({
        requesterId: userId,
        basketrequestId: basketrequestId,
        donorId: otherUserId,
        basketId: basketId,
      });

      if (existingTransaction) {
        return res
          .status(409)
          .json({
            message: "Transaction with the same fields already exists",
            data: { transaction: existingTransaction },
          });
      }

      let finalRequestId = basketrequestId;
      console.log("basketrequestId: ", basketrequestId);
      console.log("finalRequestId: ", finalRequestId);
      if (basketrequestId === null) {
        const newRequest = await BasketRequest.create({
          userId: userId,
          reason: description,
          title,
          image,
          type: "Request",
          requests: items,
          status: Status.PENDING,
          location,
          pendingTransactions: 0,
        });
        console.log("New Request Created:", newRequest); // Log new request
        finalRequestId = newRequest._id;
      }

      const basket = await BasketModel.findById(basketId);
      const basketRequest = await BasketRequest.findById(finalRequestId);

      if (
        basket?.pendingTransactions >= 4 ||
        basketRequest?.pendingTransactions >= 4
      ) {
        return res
          .status(400)
          .json({
            message:
              "Cannot create transaction. Pending transactions limit exceeded.",
          });
      }

      // Create new Transaction
      const newTransaction = await TransactionModel.create({
        requesterId: userId,
        basketrequestId: finalRequestId,
        donorId: otherUserId,
        basketId: basketId,
        createdAt: new Date(),
        matchedAt: null,
        status: Status.PENDING,
        agreedByRequester: true,
        agreedByDonor: false,
      });
      console.log("New Transaction Created:", newTransaction);

      const transactionWithUsers = await TransactionModel.findById(newTransaction._id)
      .populate('donorId')
      .populate('requesterId');

      await BasketModel.findByIdAndUpdate(basketId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });

      await BasketRequest.findByIdAndUpdate(finalRequestId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });



      // Trigger notification if the transaction is updated
      if (transactionWithUsers) {
        console.log("hello");
        try {
          await knock.workflows.trigger("donor-accept-bid", {
            actor: { id: transactionWithUsers.requesterId._id, collection: "User" },
            recipients: [
              {
                id: transactionWithUsers.donorId._id,
                email: transactionWithUsers.donorId.email,
                // username: newTransaction.donorId.username,
              },
            ],
            data: {
              name: transactionWithUsers.requesterId.username,
              id: transactionWithUsers._id,
              message: "want to request to you. Click here to view details",
              type: "Request"
            },
          });
          console.log("Knock notification sent!");
        } catch (error) {
          console.error("Error sending Knock notification:", error);
        }
      }

      res
        .status(201)
        .json({
          message: "Transaction successfully created for requester",
          data: { transaction: newTransaction },
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
