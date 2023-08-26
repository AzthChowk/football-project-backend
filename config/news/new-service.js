import { News } from "./newsModel.js";

//CREATE NEWS - ADD TO DATABASE
export const createNews = async (req, res) => {
  console.log(req.body);
  const newNewsAfterValidatedNews = req.newsData;
  try {
    await News.create(newNewsAfterValidatedNews);
    return res.send({
      success: true,
      message: "News Added successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      success: false,
      message: "FAILED, CANNOT ADD NEWS.",
    });
  }
};
