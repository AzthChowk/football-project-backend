import mongoose from "mongoose";
import { User } from "../user/userModel.js";

const newsModel = new mongoose.Schema({
  newsTitle: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 10,
  },
  newsAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  fullNews: {
    type: String,
    required: true,
  },
  newsHighlights: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  isFeaturedNews: {
    type: Boolean,
    default: false,
  },
  newsImgUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ["abc", "xyz"],
  },
  tags: {
    type: Array,
  },
});

export const News = mongoose.model("News", newsModel);
