import express from "express";
import { isReporter } from "../../auth/authorization-middleware.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { createNews, editNews } from "./new-service.js";
import { News } from "./newsModel.js";

// import News from "../models/newsModel.js";

const router = express.Router();
//POST
router.post("/news/create", createNews);

//Edit
router.put("/news/edit/:id", editNews);

//GET
router.get("/news", async (req, res) => {
  const getNews = await News.aggregate([
    {
      $match: {},
    },
    {
      $sort: { addedDate: -1 },
    },
  ]);
  return res.status(200).send(getNews);
});

//GET latest news - home page
router.get("/news/latest", async (req, res) => {
  const getLatestNews = await News.aggregate([
    {
      $match: {},
    },
    {
      $sort: { addedDate: -1 },
    },
    {
      $limit: 4,
    },
  ]);
  return res.status(200).send(getLatestNews);
});

//GET featured news - home page
router.get("/news/featured", async (req, res) => {
  const getFeaturedNews = await News.aggregate([
    {
      $match: { isFeaturedNews: true },
    },
    {
      $sort: { addedDate: -1 },
    },
    {
      $limit: 2,
    },
  ]);
  return res.status(200).send(getFeaturedNews);
});

//GET reporter news - reporter-dashboard
router.post("/reporter/news", isReporter, async (req, res) => {
  const reporterId = req.userInfo;
  console.log(reporterId._id);

  const getReporterNewsOnly = await News.aggregate([
    { $match: { newsAuthor: reporterId._id } },
    {
      $project: {
        _id: 1,
        newsTitle: 1,
        addedDate: 1,
        newsHighlights: 1,
        newsImgUrl: 1,
        isFeaturedNews: 1,
        category: 1,
        tags: 1,
        fullNews: 1,
      },
    },
  ]);

  return res.status(200).send(getReporterNewsOnly);
});

//GET featured news - home page
router.delete("/news/deleteall", async (req, res) => {
  await News.deleteMany({});
  return res.status(200).send("All news deleted.");
});

//GET featured news - home page
router.delete("/news/delete/:id", async (req, res) => {
  const newsId = req.params.id;
  const checkNewsIsMongoValidity = checkMongoIdValidity(newsId);
  if (!checkNewsIsMongoValidity) {
    return res
      .status(400)
      .send({ message: "The given id of the news is not valid mongo id." });
  }

  //find news
  const findNews = await News.findOne({ _id: newsId });
  if (!findNews) {
    return res
      .status(400)
      .send({ message: "The given id of the news does not exist." });
  }
  await News.deleteOne({ _id: newsId });
  return res.status(200).send({ message: "News is deleted successfully." });
});

//GET news details
router.get("/news/:id", async (req, res) => {
  const newsId = req.params.id;
  try {
    const checkNewsIdMongoId = checkMongoIdValidity(newsId);
    if (!checkNewsIdMongoId) {
      return res.status(400).send({ message: "The given id is not valid." });
    }
    const getNews = await News.findOne({ _id: newsId });
    return res.status(200).send(getNews);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
