export default function handler(req, res) {
  if (req.method === "POST") {
    // Set the cookie expiration date to the past to remove the cookie
    res.setHeader(
      "Set-Cookie",
      "token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
