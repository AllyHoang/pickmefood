import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";
import { Status, TransactionModel } from "@/core/models/Transaction";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();

  if (method === 'POST') {
    try {
      const { userId, requestId, otherUserId, itemId, quantity, description, itemName, emoji } = req.body;

      const existingTransaction = await TransactionModel.findOne({
        requesterId: userId,
        requestId: requestId,
        donorId: otherUserId,
        itemId: itemId
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Transaction with the same fields already exists', data: { transaction: existingTransaction } });
      }

      let finalRequestId = requestId; 
      if (!requestId) {
        const newRequest = await RequestModel.create({
          userId: userId,
        //TODO: Might add location field to User Schema
          location: "Default Location",
          reason: description,
          quantity: quantity,
          itemName: itemName,
          emoji: emoji,
        });
        console.log(newRequest);
        finalRequestId = newRequest._id;
      }

      const newTransaction = await TransactionModel.create({
        requesterId: userId,
        requestId: finalRequestId,
        donorId: otherUserId,
        itemId: itemId,
        createdAt: new Date(),
        matchedAt: null,
        status: Status.INITIATED,
        agreedByRequester: false,
        agreedByDonor : false,
      });

      res.status(201).json({ message: 'Transaction successfully created for requester' , data: { transaction: newTransaction}});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}