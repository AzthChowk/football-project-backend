import { Admin } from "./adminModel.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  //validated data from joi - req.adminData
  const newAdminAfterValidation = req.adminData;

  //encrypt the password
  const hashedPassword = await bcrypt.hash(
    newAdminAfterValidation.password,
    10
  );
  newAdminAfterValidation.password = hashedPassword;
  console.log(hashedPassword);

  //insert into the database.
  try {
    await Admin.create(newAdminAfterValidation);
    return res.status(201).send({
      success: true,
      message: "Admin created successfully.",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      error,
    });
  }
};
