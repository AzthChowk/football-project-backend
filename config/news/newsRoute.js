import express from "express";
import { News } from "./newsModel.js";
import { createNews } from "./new-service.js";
import { validateNews } from "./news-validation.js";
import { isAdmin } from "../../auth/authorization-middleware.js";

// import News from "../models/newsModel.js";

const router = express.Router();
//POST
router.post("/news/create", isAdmin, validateNews, createNews);

//GET
router.get("/news", async (req, res) => {
  try {
    const getNews = await News.find();
    console.log(getNews);
    return res.status(200).send(getNews);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      success: false,
      message: "CANNOT GET NEWS",
    });
  }
});

export default router;
