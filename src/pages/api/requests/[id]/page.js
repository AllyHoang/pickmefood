import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await connectToDB();
    const requestId = req.query.id;
    const deletedRequest = await RequestModel.findByIdAndDelete(requestId)
    if (deletedRequest) {
      res.status(200).json({message: "Request deleted", data: {item: deletedRequest}});
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  }
}
