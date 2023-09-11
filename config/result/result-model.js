import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  isMatchFinished: {
    type: Boolean,
    default: false,
  },
  matchNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  opponentOne: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Team",
  },
  opponentTwo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Team",
  },
  opponentOneGoalScore: {
    type: Number,
    default: 0,
  },
  opponentTwoGoalScore: {
    type: Number,
    default: 0,
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
});
export const Result = mongoose.model("Result", resultSchema);
