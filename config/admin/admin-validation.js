import Joi from "joi";

export const validateAdmin = async (req, res, next) => {
  const newAdmin = req.body;

  //joi validation
  const schema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(null).allow("").optional(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female"),
    role: Joi.string().valid("Administrator"),
  });
  try {
    const validatedAdminData = await schema.validateAsync(newAdmin);
    req.adminData = validatedAdminData;
    next();
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
