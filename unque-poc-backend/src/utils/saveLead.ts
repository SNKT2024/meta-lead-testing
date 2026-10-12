import { Lead } from "../models/leadModel";

export async function saveLead(raw: any) {
  // Extract only essential details from the Graph API payload
  const get = (name: any) =>
    raw.field_data.find((f: any) => f.name === name)?.values[0] || null;

  // Save to DB and return saved data
  return Lead.create({
    full_name: get("full_name"),
    email: get("email"),
    phone_number: get("phone_number"),
    leadgen_id: raw.id,
    created_time: raw.created_time,
  });
}
