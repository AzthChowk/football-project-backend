import Joi from "joi";

export const userValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  middleName: Joi.string().allow(null).allow("").optional(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  gender: Joi.string().required().valid("male", "female"),
  role: Joi.string().valid("Administrator", "Reporter").required(),
});
