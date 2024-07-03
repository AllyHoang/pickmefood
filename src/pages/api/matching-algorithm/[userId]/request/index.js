import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import calculateMatchPercentage from "@/lib/matchingAlgorithm";
import mongoose from "mongoose";



//User is a Requester
export default async function handler(req, res) {
    await connectToDB();
    const { userId } = req.query;
    if (req.method === 'GET') {
      try {
        // Fetch baskets and requests with populated items and requests
        const baskets = await BasketModel.find().populate('items').populate('userId').exec();
        const basketRequests = await BasketRequest.find({ userId: userId }).populate('requests').populate('userId').lean();
        const matches = [];
        // Perform matching
        for (const request of basketRequests) {
            for (const basket of baskets) {
              if(basket.userId._id.toString() === userId){
                continue;
              }
              const matchPercentage = calculateMatchPercentage(basket, request, "Request");
              if (matchPercentage > 50) { // Threshold for considering a match
                matches.push({
                  _id: basket._id,
                  title: basket.title,
                  description: basket.description,
                  location: basket.location,
                  items: basket.items,
                  status:basket.status,
                  userId: basket.userId,
                  type: "Donation",
                  image: basket.image,
                  // requestId: request._id,
                  // requestTitle: request.title,
                  // requestReason: request.reason,
                  // requestLocation: request.location,
                  // requestItems: request.requests,
                  // status: request.status,
                  matchPercentage
                });
              }
            }
          }
          const topMatches = matches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

          res.status(200).json(topMatches);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }