// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import connectToDB from "@/core/db/mongodb";
import Item from "@core/models";

export default async function GET() {
  await connectToDB();

  try {
    const items = await Item.find({});
    res.status(200).json({ name: "John Doe" });
  } catch {
    throw new Error("Failed to ", console.error());
  }
}
