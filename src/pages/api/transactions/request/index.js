import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import RequestModel from "@/core/models/Request";
import {TransactionModel } from "@/core/models/Transaction";
import { Status } from "@/lib/utils";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();

  if (method === 'POST') {
    try {
      const { userId, basketrequestId, otherUserId, basketId, description, title, image, items } = req.body;

      const existingTransaction = await TransactionModel.findOne({
        requesterId: userId,
        basketrequestId: basketrequestId,
        donorId: otherUserId,
        basketId: basketId
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Transaction with the same fields already exists', data: { transaction: existingTransaction } });
      }

      let finalRequestId = basketrequestId; 
      if (!basketrequestId) {
        const newRequest = await RequestModel.create({
          userId: userId,
          //TODO: Might consider adding location field to User Schema
          reason: description,
          title,
          image,
          type: "Request",
          requests: items,
          status: Status.PENDING
        });
        console.log(newRequest);
        finalRequestId = newRequest._id;
      }

      const newTransaction = await TransactionModel.create({
        requesterId: userId,
        basketrequestId: finalRequestId,
        donorId: otherUserId,
        basketId: basketId,
        createdAt: new Date(),
        matchedAt: null,
        status: Status.PENDING,
        agreedByRequester: false,
        agreedByDonor : false,
      });
      await BasketModel.findByIdAndUpdate(basketId, { status: Status.PENDING });
      await BasketRequest.findByIdAndUpdate(basketrequestId, {status: Status.PENDING});

      res.status(201).json({ message: 'Transaction successfully created for requester' , data: { transaction: newTransaction}});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}