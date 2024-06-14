import connectToDB from "@/core/db/mongodb";
import ItemModel from "@/core/models/Item";
import { Status, TransactionModel } from "@/core/models/Transaction";
import { UserModel } from "@/core/models/User";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();
  //for donator
  if (method === 'POST') {
    try {
      //userId: ID of Donator
      //otherUserI: ID of Requester
      //itemId: ID of donation
      //requesterId: ID of request
      const { userId, requestId, otherUserId, itemId, quantity, description, itemName, emoji } = req.body;
      // Check if a transaction with the same fields already exists
      const existingTransaction = await TransactionModel.findOne({
        requesterId: userId,
        requestId: requestId,
        donorId: otherUserId,
        itemId: itemId
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Transaction with the same fields already exists', data: { transaction: existingTransaction } });
      }
      let finalItemId= itemId;
      if (!itemId) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        const newItem = await ItemModel.create({
          userId: userId,
          //TODO: Might consider adding location field to User Schema
          location: "Default Location",
          expirationDate: expirationDate,
          quantity: quantity,
          description: description,
          itemName:itemName,
          emoji: emoji,
        });
        console.log(newItem);
        finalItemId =  newItem._id;
      }
      //Create new Transaction
      const newTransaction = await TransactionModel.create({
        requesterId: userId,
        requestId: requestId,
        donorId: otherUserId,
        itemId: finalItemId,
        createdAt: new Date(),
        matchedAt: null,
        status: Status.INITIATED,
        agreedByRequester: false,
        agreedByDonor : false,
      });

      res.status(201).json({ message: 'Transaction successfully created for donator', data: { transaction: newTransaction} });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}