import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema({
  matchNumber: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
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
  opponentOneScoredGoal: {
    type: Number,
    default: 0,
  },
  opponentTwoScoredGoal: {
    type: Number,

    default: 0,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Team",

    default: "draw",
  },
  // mainRefree: {
  //   type: String,
  //   required: true,
  //   minlength: 5,
  //   maxlength: 35,
  // },
  // mainRefree: {
  //   type: String,
  //   required: true,
  //   minlength: 5,
  //   maxlength: 35,
  // },
  // linesManOne: {
  //   type: String,
  //   required: true,
  //   minlength: 5,
  //   maxlength: 35,
  // },
  // linesManTwo: {
  //   type: String,
  //   required: true,
  //   minlength: 5,
  //   maxlength: 35,
  // },
});
export const fixture = mongoose.model("Fixture", fixtureSchema);
