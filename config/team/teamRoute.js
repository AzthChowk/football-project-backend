import express from "express";
import { Team } from "./teamModel.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { teamValidationSchema } from "./teamValidation.js";

const router = express.Router();

// POST
router.post("/team/create", isAdmin, async (req, res) => {
  const newTeam = req.body;
  try {
    await teamValidationSchema.validateAsync(newTeam);
    await Team.create(newTeam);
    return res.status(201).send({
      success: true,
      message: "Team created successfully.",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
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

//delete all
router.delete("/teams/alldelete", async (req, res) => {
  await Team.deleteMany({});
  return res.status(200).send("all deleted.");
});

export default router;
