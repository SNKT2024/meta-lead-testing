import { Request, Response } from "express";
import { Lead } from "../models/leadModel";

export async function getLeadsDB(req: Request, res: Response) {
  // fetch lead from DB in descending order accroding to time
  try {
    const leads = await Lead.find().sort({ created_time: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Failed to fetch leads from DB: ", error);
    res.status(500).json({ message: "Failed to fetch leads from DB", error });
  }
}
