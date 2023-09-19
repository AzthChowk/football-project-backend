import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 55,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    nullable: true,
    maxlength: 15,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 55,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    minlength: 5,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["Administrator", "Reporter"],
    required: true,
  },
});
export const User = mongoose.model("User", userSchema);
