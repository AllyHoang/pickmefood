import { parse } from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Parse cookies from the request
    const cookies = parse(req.headers.cookie || "");

    // Clear all cookies
    const clearCookies = Object.keys(cookies).map((cookieName) => {
      return `${cookieName}=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });

    res.setHeader("Set-Cookie", clearCookies);
    res.status(200).json({ message: "Logout successful, all cookies cleared" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
  }
}
