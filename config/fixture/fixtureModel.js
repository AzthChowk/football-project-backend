import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema({
  matchNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  matchStage: {
    type: String,
    required: true,
    enum: ["Group Stage", "Quarter Final", "Semi-Final", "Play off", "Final"],
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  playGround: {
    type: String,
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
export const Fixture = mongoose.model("Fixture", fixtureSchema);
