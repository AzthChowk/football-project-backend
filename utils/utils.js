import mongoose from "mongoose";

export const checkMongoIdValidity = (inputId) => {
  return mongoose.Types.ObjectId.isValid(inputId);
};
