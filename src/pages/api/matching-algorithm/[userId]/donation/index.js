import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import calculateMatchPercentage from "@/lib/matchingAlgorithm";
import mongoose from "mongoose";



//User is a Donor
export default async function handler(req, res) {
    await connectToDB();
    const { userId } = req.query;
    if (req.method === 'GET') {
      try {
        // Fetch baskets and requests with populated items and requests
        const basketRequests = await BasketRequest.find().populate('requests').populate('userId').exec();
        const baskets= await BasketModel.find({ userId: userId }).populate('items').populate('userId').lean();
        const matches = [];
        // Perform matching
        for (const basket of baskets) {
            for (const request of basketRequests) {
              if(request.userId._id.toString() === userId){
                continue;
              }
              const matchPercentage = calculateMatchPercentage(basket, request,"Donation");
              if (matchPercentage > 50) { // Threshold for considering a match
                matches.push({
                  // basketId: basket._id,
                  // basketTitle: basket.title,
                  // basketDescription: basket.description,
                  // basketLocation: basket.location,
                  // basketItems: basket.items,
                  _id: request._id,
                  title: request.title,
                  reason: request.reason,
                  location: request.location,
                  requests: request.requests,
                  type: "Request",
                  userId: request.userId,
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