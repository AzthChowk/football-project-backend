import Joi from "joi";

export const validateNews = async (req, res, next) => {
  const newNews = req.body;
  const schema = Joi.object({
    newsTitle: Joi.string().min(10).max(100).required(),
    newsAuthor: Joi.string().min(10).max(55).required(),
    fullNews: Joi.string().required(),
    newsHighlights: Joi.string().required(),
    isFeaturedNews: Joi.boolean(),
    newsImgUrl: Joi.string(),
    category: Joi.string().valid("abc", "xyz"),
  });
  try {
    const validatedNews = await schema.validateAsync(newNews);
    req.newsData = validatedNews;
    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};
