import Joi from "joi";

export const playerValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(25).required(),
  middleName: Joi.string().allow(null).allow(""),
  lastName: Joi.string().min(2).max(25).required(),
  playerImageUrl: Joi.string().allow(null).allow(""),
  position: Joi.string().min(4).max(15).required(),
  dob: Joi.date().required(),
  nationality: Joi.string().min(2).max(25).required(),
  currentClub: Joi.string().required(),
});
