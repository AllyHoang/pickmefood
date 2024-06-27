

// Define weights
const weights = {
//   location: 0.1,
  items: 0.6,
  urgency: 0.3,
  points: 0.1,
};

// Normalize weights
const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
const normalizedWeights = {};
for (const key in weights) {
  normalizedWeights[key] = weights[key] / totalWeight;
}


function calculateLocationScore(basketLocation, requestLocation) {
  return basketLocation === requestLocation ? 1 : 0;
}

//Us is a donation
function calculateItemsScore(basketItems, requestItems) {
  const itemSet = new Set(basketItems.map(item => item.itemName));
  const matchCount = requestItems.filter(request => itemSet.has(request.itemName)).length;
  return matchCount / requestItems.length; // Return the fraction of matching items
}

//Us is a requester
function calculateItemsScore2(basketItems, requestItems) {
    const itemSet = new Set(basketItems.map(item => item.itemName));
    const matchCount = requestItems.filter(request => itemSet.has(request.itemName)).length;
    return matchCount / itemSet.size; // Return the fraction of basket items that fulfill the request
}
  

function calculateUrgencyScore(basketUrgency, requestUrgency) {
  const maxUrgency = 100; // urgency is on a scale of 0 to 100
  return 1 - Math.abs(basketUrgency - requestUrgency) / maxUrgency;
}

function calculatePointsScore(basketPoints, requestPoints) {
  const maxPoints = 100; // points are on a scale of 0 to 100
  return 1 - Math.abs(basketPoints - requestPoints) / maxPoints;
}

//matching algoritm
function calculateMatchPercentage(basket, request, type) {
//   const locationScore = calculateLocationScore(basket.location, request.location);
  const itemsScore = type ==="Donation" ? calculateItemsScore(basket.items, request.requests) : calculateItemsScore2(basket.items, request.requests);
  const urgencyScore = calculateUrgencyScore(5, 5);
  const pointsScore = calculatePointsScore(50, 50);

  const overallScore =
    // locationScore * normalizedWeights.location +
    itemsScore * normalizedWeights.items +
    urgencyScore * normalizedWeights.urgency +
    pointsScore * normalizedWeights.points;

  return Math.round(overallScore * 100); 
}


export default calculateMatchPercentage;
