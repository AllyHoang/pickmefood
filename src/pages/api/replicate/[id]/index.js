import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const prediction = await replicate.predictions.get(id);

    if (prediction?.error) {
      return res.status(500).json({ detail: prediction.error });
    }

    res.status(200).json(prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error);
    res.status(500).json({ message: "Failed to fetch prediction" });
  }
}
