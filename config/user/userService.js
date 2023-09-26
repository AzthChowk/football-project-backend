import { checkMongoIdValidity } from "../../utils/utils.js";
import { User } from "./userModel.js";
import { userValidationSchema } from "./userValidation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==================== userRegister ==========================//
export const userRegister = async (req, res) => {
  const newUser = req.body;

  //validate the userData
  try {
    await userValidationSchema.validateAsync(newUser);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  //find the user - email existence
  const findUserEmail = await User.findOne({ email: newUser.email });
  if (findUserEmail) {
    return res.status(400).send({
      message: "The user with this email already exist in the system.",
    });
  }

  //encrypt the password
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;

  //create user
  try {
    await User.create(newUser);
    return res.status(201).send({
      success: true,
      message: "User is created successfully.",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================User Login ====================//
export const userLogin = async (req, res) => {
  //extract email and password from req.body
  const loginCredentials = req.body;

  // find the user in the database
  const findUser = await User.findOne({
    email: loginCredentials.email,
  });

  //if not found, terminate
  if (!findUser) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid Credentials." });
  }

  // if found, compare the password using bcrypt
  const passwordMatch = await bcrypt.compare(
    loginCredentials.password, //normal password
    findUser.password //hashed password
  );

  //if password does not match, terminate
  if (!passwordMatch) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid Credentials." });
  }

  //if password match, assign access token
  const accessToken = jwt.sign(
    { _id: findUser._id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
  );
  findUser.password = "";
  return res
    .status(200)
    .send({ success: true, message: "Login success", findUser, accessToken });
};

// ==================find user details ====================//
export const findUserDetails = async (req, res) => {
  const inputId = req.params.id;

  //check the validity of MongoId
  const checkInputIdMongoIdValidity = checkMongoIdValidity(inputId);

  //if not valid, terminate
  if (!checkInputIdMongoIdValidity) {
    res.status(400).send({
      success: false,
      message: "Error, the given id is not valid id.",
    });
  }

  //if valid, find the user
  const findUser = await User.findOne({ _id: inputId });
  findUser.password = "";
  if (!findUser) {
    return res
      .status(404)
      .send({ message: "User with the given id is not found." });
  }
  return res.status(200).send(findUser);
};
