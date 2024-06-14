import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Check for the API token in the environment
  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({
      message:
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.",
    });
  }

  try {
    // Parse the request body
    const { prompt } = await req.body;

    // Validate the input
    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid prompt. Please provide a valid prompt." });
    }

    // Set options for the Replicate API call
    const options = {
      version:
        "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
      input: { prompt },
    };

    // Create a prediction using the Replicate API
    const prediction = await replicate.predictions.create(options);

    // Handle errors in the prediction
    if (prediction?.error) {
      return res.status(500).json({ detail: prediction.error });
    }

    // Return the prediction result
    res.status(201).json(prediction);
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating prediction:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
}
