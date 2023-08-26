import Joi from "joi";

export const validateAdmin = async (req, res, next) => {
  const newAdmin = req.body;

  const schema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female"),
    mobileNumber: Joi.string().min(10).required(),
    role: Joi.string().valid("administrator"),
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
