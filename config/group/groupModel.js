import mongoose from "mongoose";

const teamsGroupSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // enum: [
    //   "group a",
    //   "group b",
    //   "group c",
    //   "group d",
    //   "group e",
    //   "group f",
    //   "group g",
    //   "group h",
    //   "group i",
    //   "group j",
    // ],
    trim: true,
  },
  teamsList: {
    type: [teamsGroupSchema],
  },
});
export const Group = mongoose.model("Group", groupSchema);
