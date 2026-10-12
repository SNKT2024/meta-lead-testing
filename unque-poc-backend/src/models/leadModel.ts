import mongoose from "mongoose";
const { Schema } = mongoose;

const leadSchema = new Schema({
  full_name: { type: String, requird: true },
  email: { type: String, requird: true },
  phone_number: { type: String, requird: true },
  leadgen_id: { type: String, required: true, unique: true },
  created_time: { type: String },
});

export const Lead = mongoose.model("Lead", leadSchema);
