import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  isMatchFinished: {
    type: Boolean,
    default: false,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Fixture",
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
});
export const Result = mongoose.model("Result", resultSchema);
