import express from "express";
import { Team } from "./teamModel.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { teamValidationSchema } from "./teamValidation.js";
import { Player } from "../player/playerModel.js";

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

// GET ALL TEAMS
router.post("/team/:id/players", async (req, res) => {
  const teamId = req.params.id;
  console.log(teamId);

  // check mongoid
  const teamIdMongoIdValidity = checkMongoIdValidity(teamId);
  if (!teamIdMongoIdValidity) {
    return res.status(400).send({ message: "The input id is not valid." });
  }

  // find the team existence
  const findTeam = await Team.findOne({ _id: teamId });
  if (!findTeam) {
    return res
      .status(404)
      .send({ message: "The team with the given id does not exist." });
  }

  //if team exist - search players
  const teamPlayersList = await Player.find({ currentClub: teamId });
  if (!teamPlayersList) {
    return res.status(404).send({ message: "Players not found." });
  }

  // const teamPlayersList = await Player.aggregate([
  //   { $match: { currentClub: teamId } },
  //   {
  //     $project: {
  //       fullName: {
  //         $concat: ["$firstName", " ", "$middleName", " ", "$lastName"],
  //       },
  //       playerImageUrl: 1,
  //       position: 1,
  //       dob: 1,
  //       nationality: 1,
  //     },
  //   },
  // ]);

  res.status(200).send(teamPlayersList);
});

// GET A TEAM
router.post("/team/:id", async (req, res) => {
  const teamId = req.params.id;

  const resultOfMongoIdValidityCheck = checkMongoIdValidity(teamId);
  if (!resultOfMongoIdValidityCheck) {
    return res.status(400).send("The MongoId is not valid.");
  }
  try {
    const findTeam = await Team.findOne({ _id: teamId });
    if (!findTeam)
      return res
        .status(400)
        .send({ message: "Team with the given id does not exist." });
    const teamPlayersList = await Player.find({ currentClub: teamId });
    if (!teamPlayersList) {
      return res.status(404).send({ message: "Players not found." });
    }
    return res.status(200).send(findTeam);
  } catch (error) {
    return res.status(400).send({ message: error.message });
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
