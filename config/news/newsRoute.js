import express from "express";
import { News } from "./newsModel.js";
import { createNews } from "./new-service.js";
import { validateNews } from "./news-validation.js";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { checkMongoIdValidity } from "../../utils/utils.js";

// import News from "../models/newsModel.js";

const router = express.Router();
//POST
router.post("/news/create", isAdmin, validateNews, createNews);

//GET
router.get("/news", async (req, res) => {
  try {
    const getNews = await News.find();
    return res.status(200).send(getNews);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      success: false,
      message: "CANNOT GET NEWS",
    });
  }
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
      message: "Cannot get the news",
    });
  }
});

//GET latest news - home page
router.get("/news/latest", async (req, res) => {
  try {
    const getLatestNews = await News.aggregate([
      {
        $match: {},
      },
      {
        $limit: 4,
      },
      {
        $sort: { addedDate: -1 },
      },
    ]);
    return res.status(200).send(getLatestNews);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      success: false,
      message: "CANNOT GET NEWS",
    });
  }
});
//GET featured news - home page
router.get("/news/featured", async (req, res) => {
  try {
    const getFeaturedNews = await News.aggregate([
      {
        $match: { isFeaturedNews: true },
      },
      {
        $limit: 2,
      },
      {
        $sort: { addedDate: -1 },
      },
    ]);
    return res.status(200).send(getFeaturedNews);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      success: false,
      message: "CANNOT GET NEWS",
    });
  }
});

export default router;
