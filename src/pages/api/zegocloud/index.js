import { generateToken04 } from "./zegoServerAssistant";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userID } = req.query;

    const appID = 1781104651;
    const serverSecret = "91f06bc51a903c717eef589f802105dc";

    const effectiveTimeInSeconds = 3600;
    const payload = "";

    try {
      const token = generateToken04(
        appID,
        userID,
        serverSecret,
        effectiveTimeInSeconds,
        payload
      );
      return res.json({ token, appID });
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ error: "Failed to generate token" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
