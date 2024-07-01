import ItemModel from "@/core/models/Item";
import RequestModel from "@/core/models/Request";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractStateAndZip(location) {
  if (typeof location !== "string") {
    return "";
  }

  const regex = /,\s*([A-Za-z\s]+)\s+(\d{5}),\s*United States$/;

  const match = location.match(regex);

  if (match) {
    const state = match[1].trim();
    const zip = match[2] ? match[2].trim() : "";
    return zip ? `${state}, ${zip}` : state;
  }
  return "";
}

export function getMatchingItemsInOneTransaction(transaction) {
  console.log("transaction:", transaction);
  const basketItems = transaction.basketId.items || [];
  const requestItems = transaction.basketrequestId?.requests || [];
  const matchingItems = basketItems.filter((basketItem) =>
    requestItems.some(
      (requestItem) => requestItem.itemName === basketItem.itemName
    )
  );

  console.log("matchingItems: ", matchingItems);

  return matchingItems;
}

export function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Define the Status enum
const Status = {
  INITIATED: "initiated",
  PENDING: "pending",
  ACCEPTED: "accepted",
  CANCELED: "canceled",
};

export { Status };

// Define the Points
const POINTS = {
  DONATION: 10,
  TRANSACTION: 200,
};
export { POINTS };

/**
 * Helper function to compare items in a basket with requests in a basketRequest
 * and return an array of objects with { name, emoji } fields.
 *
 * @param {Object} basket - The basket object containing an array of items.
 * @param {Object} basketRequest - The basketRequest object containing an array of requests.
 * @returns {Array<{ name: string, emoji: string }>}
 */
async function getMatchingItems(items, requests) {
  try {
    console.log("basketId.items: ", items);
    console.log("basketrequestId.items: ", requests);

    const result = [];

    items?.forEach((item) => {
      requests?.forEach((request) => {
        if (item?.itemName === request?.itemName) {
          result.push({
            name: item?.itemName,
            emoji: item?.emoji,
          });
        }
      });
    });
    console.log("hello, ", result);
    return result;
  } catch (error) {
    console.error("Error comparing items:", error);
    throw new Error("Failed to compare basket and request items");
  }
}

export default getMatchingItems;
