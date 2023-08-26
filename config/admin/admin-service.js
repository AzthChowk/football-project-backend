import { Admin } from "./adminModel.js";

export const createAdmin = async (req, res) => {
  const newAdminAfterValidation = req.adminData;
  const hashedPassword = await bcrypt.hash(
    newAdminAfterValidation.password,
    10
  );
  newAdminAfterValidation.password = hashedPassword;
  console.log(hashedPassword);
  try {
    await Admin.create(newAdminAfterValidation);
    return res.status(201).send({
      success: true,
      message: "ADMIN CREATED SUCCESSFUL.",
    });
  } catch (error) {
    console.log({
      success: false,
      message: error.message,
    });
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
