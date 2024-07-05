import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { TransactionModel } from "@/core/models/Transaction";
import { UserModel } from "@/core/models/User";
import { Status } from "@/lib/utils";
import { Knock } from "@knocklabs/node";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();
  //for donator
  if (method === "POST") {
    try {
      //userId: ID of Donator
      //otherUserID: ID of Requester
      //basketId: ID of donation
      //basletrequestId: ID of request
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
      // Check if a transaction with the same fields already exists
      const knock = new Knock(
        process.env.KNOCK_SECRET_KEY
      );
      const existingTransaction = await TransactionModel.findOne({
        requesterId: otherUserId,
        basketrequestId: basketrequestId,
        donorId: userId,
        basketId: basketId,
      });
      console.log("items: ", items);
      if (existingTransaction) {
        return res.status(409).json({
          message: "Transaction with the same fields already exists",
          data: { transaction: existingTransaction },
        });
      }

      let finalItemId = basketId;
      if (basketId === null) {
        const newBasket = await BasketModel.create({
          userId: userId,
          description,
          title,
          image,
          type: "Donation",
          items: items,
          status: Status.PENDING,
          location,
          pendingTransactions: 0,
        });
        console.log("newBasket: ", newBasket);
        finalItemId = newBasket._id;
      }

      const basket = await BasketModel.findById(finalItemId);
      const basketRequest = await BasketRequest.findById(basketrequestId);

      if (
        basket?.pendingTransactions >= 4 ||
        basketRequest?.pendingTransactions >= 4
      ) {
        return res.status(400).json({
          message:
            "Cannot create transaction. Pending transactions limit exceeded.",
        });
      }

      //Create new Transaction
      const newTransaction = await TransactionModel.create({
        requesterId: otherUserId,
        basketrequestId: basketrequestId,
        donorId: userId,
        basketId: finalItemId,
        createdAt: new Date(),
        matchedAt: null,
        status: Status.PENDING,
        agreedByRequester: false,
        agreedByDonor: true,
      });
      const transactionWithUsers = await TransactionModel.findById(newTransaction._id)
      .populate('donorId')
      .populate('requesterId');
    
      await BasketModel.findByIdAndUpdate(finalItemId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });

      await BasketRequest.findByIdAndUpdate(basketrequestId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });

      // Trigger notification if the transaction is updated
      if (transactionWithUsers) {
        try {
          await knock.workflows.trigger("donor-accept-bid", {
            actor: { id: transactionWithUsers.donorId._id, collection: "User" },
            recipients: [
              {
                id: transactionWithUsers.requesterId._id,
                email: transactionWithUsers.requesterId.email,
                // username: newTransaction.requesterId.username,
              },
            ],
            data: {
              name: transactionWithUsers.donorId.username,
              id: transactionWithUsers._id,
              message: "want to donate to you. Click here to view details",
              type: "Donation"
            },
          });
          console.log("Knock notification sent!");
        } catch (error) {
          console.error("Error sending Knock notification:", error);
        }
      }

      res.status(201).json({
        message: "Transaction successfully created for donator",
        data: { transaction: newTransaction },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
