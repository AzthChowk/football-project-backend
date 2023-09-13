import mongoose from "mongoose";

const newsModel = new mongoose.Schema({
  newsTitle: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 10,
  },
  newsAuthor: {
    type: String,
    required: true,
    maxlength: 55,
    minlength: 10,
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
  // tags: {
  //   type: Array,
  // },
});

export const News = mongoose.model("News", newsModel);
