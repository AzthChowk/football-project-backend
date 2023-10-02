import Joi from "joi";

export const newsValidationSchema = Joi.object({
  newsTitle: Joi.string().min(10).max(100).required(),
  newsAuthor: Joi.string().min(10).max(55).required(),
  fullNews: Joi.string().required(),
  newsHighlights: Joi.string().required(),
  isFeaturedNews: Joi.boolean(),
  newsImgUrl: Joi.string(),
  category: Joi.string().valid("abc", "xyz"),
  tags: Joi.string().allow(null).allow(""),
});
