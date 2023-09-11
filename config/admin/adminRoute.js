import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Admin } from "./adminModel.js";
import { createAdmin } from "./admin-service.js";
import { validateAdmin } from "./admin-validation.js";

const router = express.Router();

//POST
router.post("/admin/create", validateAdmin, createAdmin);

//login
router.post("/login", async (req, res) => {
  //extract email and password from req.body
  const loginCredentials = req.body;

  // find the user in the database
  const findUser = await Admin.findOne({
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
    { expiresIn: "1d" }
  );
  findUser.password = "";
  return res
    .status(200)
    .send({ success: true, message: "Login success", accessToken });
});

//FIND
router.get("/admin/:id", async (req, res) => {
  //extract input id from params
  const inputId = req.params.id;

  //check the validity of MongoId
  const checkGivenIdMongoIdOrNot = ObjectId.isValid(inputId);

  //if not valid, terminate
  if (!checkGivenIdMongoIdOrNot) {
    res.status(400).send({
      success: false,
      message: "ERROR, GIVEN ID IS NOT A VALID ID.",
    });
  }

  //if valid, find the user
  try {
    const checkGivenIdExistOrNot = await Admin.findOne({ _id: inputId });
    console.log(checkGivenIdExistOrNot);
    res.send(checkGivenIdExistOrNot);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      success: false,
      message: "THE GIVEN ID DOES NOT EXIST.",
    });
  }
});

export default router;
