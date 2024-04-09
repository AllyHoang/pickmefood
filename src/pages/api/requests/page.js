import connectToDB from "@/core/db/mongodb";
import RequestModel from "@/core/models/Request";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res){
    if(req.method == "POST"){
        await connectToDB();
        const newRequest = await RequestModel.create(req.body);
        res.status(201).json({ message: "Request Created", data: { request: newRequest }});
    } else if(req.method == "GET"){
        await connectToDB();
        const requests = await RequestModel.find();
        res.status(200).json({ requests});
    }
    else{
        res.status(405).json({ message: "Method Not Allowed"});
    }
}