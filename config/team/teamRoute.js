import express from "express";
import { Team } from "./teamModel.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { isAdmin } from "../../auth/authorization-middleware.js";

const router = express.Router();

// POST
router.post("/team/create", isAdmin, async (req, res) => {
  const newTeam = req.body;
  console.log(newTeam);
  const createNewTeam = await Team.create(newTeam);
  if (!createNewTeam) {
    res.status(400).send({
      success: false,
      message: "FAILED",
    });
  }
  res.status(201).send({
    success: true,
    message: "TEAM CREATED SUCCESSFULLY.",
  });
});

// GET ALL TEAMS
router.post("/teams", async (req, res) => {
  const teamList = await Team.find({});
  if (!teamList) {
    res.status(400).send({
      success: false,
      message: "CANNOT FETCH DATA",
    });
  }
  res.status(200).send(teamList);
});

// GET A TEAM
router.get("/team/:id", async (req, res) => {
  const teamId = req.params.id;
  console.log(teamId);
  const resultOfMongoIdValidityCheck = checkMongoIdValidity(teamId);
  if (!resultOfMongoIdValidityCheck) {
    return res.status(400).send("The MongoId is not valid.");
  }
  try {
    const findTeam = await Team.findOne({ _id: teamId });
    if (!findTeam) return res.status(400).send("Not found.");
    return res.status(200).send(findTeam);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});
// DELETE TEAM
router.delete("/team/delete/:id", isAdmin, async (req, res) => {
  const deleteId = req.params.id;
  const resultOfMongoIdValidityCheck = checkMongoIdValidity(deleteId);
  if (!resultOfMongoIdValidityCheck) {
    return res.status(400).send("Not Valid MongoId.");
  }
  const findDeleteId = await Team.findById(deleteId);
  if (!findDeleteId) {
    res.send("The Team does not exist");
  }
  try {
    const isDeleted = await Team.deleteOne({ _id: deleteId });
    if (isDeleted) {
      return res.send("Deleted Successfully.");
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
