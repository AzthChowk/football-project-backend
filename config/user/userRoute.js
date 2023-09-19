import express from "express";
import { findUserDetails, userLogin, userRegister } from "./userService.js";

const router = express.Router();

//POST
router.post("/user/register", userRegister);

// LOGIN
router.post("/login", userLogin);

//FIND
router.post("/user/:id", findUserDetails);

//FIND
router.put("/user/edit/:id", (req, res) => {
  return res.status(200).send("edited");
});

export default router;
