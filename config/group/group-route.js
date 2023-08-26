import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { Group } from "./groupModel.js";

const router = express.Router();

//create group
router.post("/group/create", isAdmin, async (req, res) => {
  const newGroup = req.body;
  try {
    await Group.create(newGroup);
    return res.status(201).send(`${newGroup.name} created successfully.`);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});
//get group
router.get("/group/:id", isAdmin, async (req, res) => {
  const inputSearchId = req.params.id;
  try {
    const findGroup = await Group.findOne({ _id: inputSearchId });
    console.log(findGroup);
    return res.status(200).send(findGroup);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
