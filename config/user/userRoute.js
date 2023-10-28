import express from "express";
import { findUserDetails, userLogin, userRegister } from "./userService.js";
import { User } from "./userModel.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const router = express.Router();

//POST
router.post("/user/register", userRegister);

// LOGIN
router.post("/login", userLogin);

//FIND
router.post("/user/:id", findUserDetails);

//GET
router.get("/users", async (req, res) => {
  const usersList = await User.find({});
  return res.status(200).send(usersList);
});

//GET reporter details
router.get("/user/reporter/:id", async (req, res) => {
  const reporterId = req.params.id;
  const checkId = checkMongoIdValidity(reporterId);
  if (!checkId) {
    return res.status(400).send({ message: "The provided id is not valid." });
  }
  const findReporter = await User.findOne({ _id: reporterId });
  if (!findReporter) {
    return res
      .status(400)
      .send({ message: "The reporter with the given id does not exist." });
  }
  return res.status(200).send(findReporter);
});

//change password
router.put("/user/changepassword", async (req, res) => {
  let inputsForPwChange = req.body;
  const uId = req.body.id;
  const userId = new ObjectId(uId);
  console.log(inputsForPwChange);
  const checkId = checkMongoIdValidity(userId);
  if (!checkId) {
    return res.status(400).send({ message: "The provided id is not valid." });
  }
  const findUser = await User.findOne({ _id: userId });
  if (!findUser) {
    return res
      .status(400)
      .send({ message: "The reporter with the given id does not exist." });
  }
  //match the current password
  const passwordMatch = await bcrypt.compare(
    inputsForPwChange.currentPassword,
    findUser.password
  );

  if (!passwordMatch) {
    return res
      .status(400)
      .send({ message: "Current password does not match." });
  }

  //hash new password
  const newPasswordHashed = await bcrypt.hash(
    inputsForPwChange.newPassword,
    10
  );
  //compare the current and new password
  if (inputsForPwChange.currentPassword === inputsForPwChange.newPassword) {
    return res
      .status(400)
      .send({ message: "New password and old password cannot be same." });
  }
  await User.updateOne(
    { _id: userId },
    { $set: { password: newPasswordHashed } }
  );

  return res.status(200).send({ message: "Password is changed successfully." });
});

//put
router.put("/user/edit/:id", (req, res) => {
  return res.status(200).send("edited");
});

export default router;
