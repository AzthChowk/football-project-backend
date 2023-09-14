import Joi from "joi";

export const playerValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(25).required(),
  middleName: Joi.string().allow(null),
  lastName: Joi.string().min(2).max(25).required(),
  playerImage: Joi.string().required(),
  position: Joi.string().min(4).max(15).required(),
  dob: Joi.date().required(),
  nationality: Joi.string().min(2).max(25).required(),
  currentClub: Joi.string().required(),
});
