import connectToDB from "@/core/db/mongodb";
import BasketModel from "@/core/models/Basket";
import BasketRequest from "@/core/models/BasketRequest";
import calculateMatchPercentage from "@/lib/matchingAlgorithm";



export default async function handler(req, res) {
    await connectToDB();
  
    if (req.method === 'GET') {
      try {
        // Fetch baskets and requests with populated items and requests
        const baskets = await BasketModel.find().populate('items').exec();
        const basketRequests = await BasketRequest.find().populate('requests').exec();
        const matches = [];
  
        // Perform matching
        for (const request of basketRequests) {
            for (const basket of baskets) {
              const matchPercentage = calculateMatchPercentage(basket, request);
              if (matchPercentage > 50) { // Threshold for considering a match
                matches.push({
                  basketId: basket._id,
                  basketTitle: basket.title,
                  basketDescription: basket.description,
                  basketLocation: basket.location,
                  basketItems: basket.items,
                  requestId: request._id,
                  requestTitle: request.title,
                  requestReason: request.reason,
                  requestLocation: request.location,
                  requestItems: request.requests,
                  matchPercentage
                });
              }
            }
          }
  
        res.status(200).json(matches);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }