import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionCheck = await mongoose.connect(process.env.MONGO_URL);
    console.log("DATABASE CONNECTION SUCCESSFUL.");
  } catch (error) {
    console.log("DATABASE CONNECTION FAILED.");
  }
};
export default connectDB;
