import Joi from "joi";

export const resultValidationSchema = Joi.object({
  isMatchFinished: Joi.boolean().required(),
  matchId: Joi.string().required(),
  opponentOne: Joi.string().required(),
  opponentTwo: Joi.string().required(),
  opponentOneGoalScore: Joi.number().required(),
  opponentTwoGoalScore: Joi.number().required(),
});
