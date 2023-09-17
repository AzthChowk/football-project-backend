import Joi from "joi";

export const teamValidationSchema = Joi.object({
  teamName: Joi.string().required("Team name is required."),
  teamLogo: Joi.string().allow(null).allow(""),
  address: Joi.string().required("Team address is required."),
  url: Joi.string(),
  manager: Joi.string().required("Manager name is required."),
  coach: Joi.string().required("Coach name is required."),
});
