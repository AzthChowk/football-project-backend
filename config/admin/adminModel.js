import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 55,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    minlength: 2,
    maxlength: 55,
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
  mobileNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    trim: true,
  },
  role: {
    type: String,
    default: "administrator",
  },
});
export const Admin = mongoose.model("Admin", adminSchema);
