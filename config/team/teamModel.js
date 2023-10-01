import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    minlength: 4,
    maxlength: 50,
    trim: true,
    required: true,
  },
  teamLogo: {
    type: String,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  group: {
    type: String,
  },
  url: {
    type: String,
    minlength: 9,
    maxlength: 30,
    required: true,
    lowercase: true,
  },
  manager: {
    type: String,
    minlength: 5,
    maxlength: 30,
    required: true,
  },
  coach: {
    type: String,
    minlength: 5,
    maxlength: 30,
    required: true,
  },
  //   captain: {
  //     type: String,
  //     minlength: 5,
  //     maxlength: 30,
  //     required: true,
  //     // id: mongoose.Schema.Types.ObjectId,
  //     // required: true,
  //     // ref: "player",
  //   },
});
export const Team = mongoose.model("Team", teamSchema);
