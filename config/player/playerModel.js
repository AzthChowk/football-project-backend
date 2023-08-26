import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
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
    playerImage: {
      type: String,
      required: true,
    },
    position: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    currentClub: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "team",
    },
  },
  {
    timestamps: true,
  }
);
export const Player = mongoose.model("Player", playerSchema);
