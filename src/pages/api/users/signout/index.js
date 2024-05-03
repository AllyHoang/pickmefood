import { NextResponse } from 'next/server';

export default function handler(req, res) {
  if (req.method === "POST") {
    //Set the cookie expiration date to the past to remove cookie
    res.setHeader("Set-Cookie", 'token=; HttpOnly; Path=/; Expires=Thu, 25 Apr 2024 00:00:00 GMT');
    res.status(200).json({ message: "Logout successful" });
    return;
  } else {
    return NextResponse.json({ error: "Logout unsuccessful" }, { status: 401 });
  }
}

