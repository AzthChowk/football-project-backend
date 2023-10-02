import mongoose from "mongoose";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { User } from "../user/userModel.js";
import { newsValidationSchema } from "./news-validation.js";
import { News } from "./newsModel.js";

//CREATE NEWS - ADD TO DATABASE
export const createNews = async (req, res) => {
  const newsInputData = req.body;
  try {
    await newsValidationSchema.validateAsync(newsInputData);
    await News.create(newsInputData);
    return res.send({
      success: true,
      message: "News Added successfully.",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// Edit News
export const editNews = async (req, res) => {
  const newsId = req.params.id;
  const updateNews = req.body;
  const authorId = req.body.newsAuthor;

  // check mongodb id
  const newsIdMongoIdValidity = checkMongoIdValidity(newsId);
  if (!newsIdMongoIdValidity) {
    return res
      .status(400)
      .send({ message: "The input id of a news is not valid Mongo Id." });
  }

  // //check News author mongoid
  // const authorIdMongoIdValidity = checkMongoIdValidity(authorId);
  // if (!authorIdMongoIdValidity) {
  //   return res
  //     .status(400)
  //     .send({ message: "The input id of an author is not valid Mongo Id." });
  // }

  // validation
  try {
    await newsValidationSchema.validateAsync(updateNews);
    const findAuthor = await User.findOne({ _id: authorId });
    if (!findAuthor) {
      return res.status(400).send({
        success: false,
        message: "The author with the given id does not exist.",
      });
    }
    const findNews = await News.findOne({ _id: newsId });
    if (!findNews) {
      return res.status(400).send({
        success: false,
        message: "The news with the given id does not exist.",
      });
    }
    const newsToUpdate = await News.updateOne(
      { _id: newsId },
      {
        $set: {
          newsTitle: req.body.newsTitle,
          newsAuthor: req.body.newsAuthor,
          fullNews: req.body.fullNews,
          newsHighlights: req.body.newsAuthor,
          isFeaturedNews: req.body.isFeaturedNews,
          newsImgUrl: req.body.newsImgUrl,
          category: req.body.category,
          tags: req.body.tags,
        },
      }
    );

    res.status(200).send({ message: "News is updated successfully." });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};
