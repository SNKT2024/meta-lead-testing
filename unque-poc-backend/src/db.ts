import mongoose from "mongoose";

export const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
