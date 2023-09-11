import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log({
      success: true,
      message: "DATABASE CONNECTION SUCCESSFUL.",
    });
  } catch (error) {
    console.log({
      success: false,
      message: "DATABASE CONNECTION FAILED.",
      message: error.message,
    });
  }
};

export default connectDB;
