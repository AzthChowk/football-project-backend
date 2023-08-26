import bcrypt from "bcrypt";
import express from "express";
import { Admin } from "./adminModel.js";
import Joi from "joi";

import jwt from "jsonwebtoken";
import { validateAdmin } from "./admin-validation.js";
import { createAdmin } from "./admin-service.js";

const router = express.Router();

//POST
router.post("/admin/create", validateAdmin, createAdmin);

//LOGIN
// extract email and password from req.body
// validate inputId
// find user with email
// if not user throw error
// compare password with hashed password
// if not match, throw error
// generate access CancellationToken
// remove password from user Object
// send response
router.post("/login", async (req, res) => {
  const loginCredentials = req.body;

  const findUser = await Admin.findOne({
    email: loginCredentials.email,
  });

  if (!findUser) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid Credentials." });
  }

  const passwordMatch = await bcrypt.compare(
    loginCredentials.password, //normal password
    findUser.password //hashed password
  );

  if (!passwordMatch) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid Credentials." });
  }
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
  const inputId = req.params.id;
  const checkGivenIdMongoIdOrNot = ObjectId.isValid(inputId);
  if (!checkGivenIdMongoIdOrNot) {
    res.status(400).send({
      success: false,
      message: "ERROR, GIVEN ID IS NOT A VALID ID.",
    });
  }
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
