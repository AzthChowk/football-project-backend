import Joi from "joi";

export const fixtureValidateSchema = Joi.object({
  matchNumber: Joi.number().min(1),
  time: Joi.string().required(),
  date: Joi.date().required(),
  playGround: Joi.string().required(),
  opponentOne: Joi.string().required(),
  opponentTwo: Joi.string().required(),
});
