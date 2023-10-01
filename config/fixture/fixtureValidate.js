import Joi from "joi";

export const fixtureValidateSchema = Joi.object({
  matchNumber: Joi.number().min(1),
  matchStage: Joi.string().required(),
  matchGroup: Joi.string().allow(null).allow(""),
  time: Joi.string().required("Time is required."),
  date: Joi.date().required(),
  playGround: Joi.string().required(),
  opponentOne: Joi.string().required(),
  opponentTwo: Joi.string().required(),
});
