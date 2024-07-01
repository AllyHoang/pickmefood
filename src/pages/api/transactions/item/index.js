import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import { TransactionModel } from "@/core/models/Transaction";
import { UserModel } from "@/core/models/User";
import { Status } from "@/lib/utils";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();
  //for donator
  if (method === "POST") {
    try {
      //userId: ID of Donator
      //otherUserI: ID of Requester
      //itemId: ID of donation
      //requesterId: ID of request
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
      const existingTransaction = await TransactionModel.findOne({
        requesterId: otherUserId,
        basketrequestId: basketrequestId,
        donorId: userId,
        basketId: basketId,
      });
      console.log("items: ", items);
      if (existingTransaction) {
        return res
          .status(409)
          .json({
            message: "Transaction with the same fields already exists",
            data: { transaction: existingTransaction },
          });
      }

      let finalItemId = basketId;
      if (!finalItemId) {
        const newBasket = await BasketModel.create({
          userId: userId,
          //TODO: Might consider adding location field to User Schema
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
        return res
          .status(400)
          .json({
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
        agreedByDonor: false,
      });
      await BasketModel.findByIdAndUpdate(finalItemId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });

      await BasketRequest.findByIdAndUpdate(basketrequestId, {
        status: Status.PENDING,
        $inc: { pendingTransactions: 1 },
      });

      res
        .status(201)
        .json({
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
