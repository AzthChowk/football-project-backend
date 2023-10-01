import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { Group } from "./groupModel.js";

const router = express.Router();

//create group
router.post("/group/create", isAdmin, async (req, res) => {
  const newGroup = req.body;
  console.log(newGroup);
  console.log("hi");
  try {
    await Group.create(newGroup);
    return res
      .status(201)
      .send({ message: `${newGroup.name} created successfully.` });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ message: error.message });
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
