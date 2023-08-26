import mongoose from "mongoose";

const pointTableSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Team",
  },
  played: {
    type: Number,
    default: 0,
  },
  win: {
    type: Number,
    default: 0,
  },
  draw: {
    type: Number,
    default: 0,
  },
  loss: {
    type: Number,
    default: 0,
  },
  goalFor: {
    type: Number,
    default: 0,
  },
  goalAgainst: {
    type: Number,
    default: 0,
  },
  goalDifference: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
});

export const pointTable = mongoose.model("PointTable", pointTableSchema);
