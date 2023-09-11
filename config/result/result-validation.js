import Joi from "joi";

export const resultValidationSchema = Joi.object({
  isMatchFinished: Joi.boolean().required(),
  matchNumber: Joi.number().required(),
  opponentOne: Joi.string().required(),
  opponentTwo: Joi.string().required(),
  opponentOneGoalScore: Joi.number().required(),
  opponentTwoGoalScore: Joi.number().required(),
});
