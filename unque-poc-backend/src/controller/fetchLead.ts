import console from "console";
import { Request, Response, NextFunction } from "express";
import { saveLead } from "../utils/saveLead";

const api_version = process.env.API_VERSION;
const access_token = process.env.ACCESS_TOKEN;

export default async function fetchLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract leadgen_id
    const leadgen_id = req.body.entry[0].changes[0].value.leadgen_id;
    // console.log("lead_id:", leadgen_id);

    // fetch the lead data using leadgen_id
    const response = await fetch(
      `https://graph.facebook.com/${api_version}/${leadgen_id}?access_token=${access_token}`,
    );

    // Save to DB and send the data in certain schema to the client
    if (response.ok) {
      const data = await response.json();
      //   console.log("LEAD:", data);
      const lead = await saveLead(data);
      //   console.log("MONGO SAVED:", lead);
      req.body = lead;
      next();
    }
  } catch (error) {
    console.error("Failed to fetch lead", error);
  }
}
