// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectToDB from "@/core/db/mongodb";

export default async function handlder(req, res) {
  await connectToDB();
  res.status(200).json({ name: "John Doe" });
}
