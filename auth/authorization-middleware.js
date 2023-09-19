import jwt from "jsonwebtoken";
import { User } from "../config/user/userModel.js";

export const isAdmin = async (req, res, next) => {
  const authToken = req?.headers?.authorization?.split(" ");
  const token = authToken[1];
  if (!token) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findOne({ _id: userData._id });
    if (!findUser) {
      return res.status(400).send({ success: false, message: "Unauthorized." });
    }
    if (findUser.role !== "Administrator") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized, You are not administrator.",
      });
    }
    req.userInfo = findUser;
    next();
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

export const isReporter = async (req, res, next) => {
  const authToken = req?.headers?.authorization?.split(" ");
  const token = authToken[1];
  if (!token) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findOne({ _id: userData._id });
    if (!findUser) {
      return res.status(400).send({ success: false, message: "Unauthorized." });
    }
    if (findUser.role !== "Reporter") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized, You are not reporter.",
      });
    }
    req.userInfo = findUser;
    next();
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};
