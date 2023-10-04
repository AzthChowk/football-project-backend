import { Player } from "./playerModel.js";
import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import Joi from "joi";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { playerValidationSchema } from "./player-validation.js";
import { Team } from "../team/teamModel.js";

import mongoose from "mongoose";
const router = express.Router();

//CREATE
router.post("/player/create", isAdmin, async (req, res) => {
  const newPlayer = req.body;
  try {
    const validatePlayer = await playerValidationSchema.validateAsync(
      newPlayer
    );
    if (!validatePlayer) return res.status(400).send("Error on Validation.");
    const findCurrentClubExistence = await Team.findOne({
      _id: validatePlayer.currentClub,
    });

    if (!findCurrentClubExistence)
      return res.status(400).send("No Team found.");
    await Player.create(newPlayer);
    return res
      .status(201)
      .send({ success: true, message: "New Player is added successfully." });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get the player
router.post("/players", async (req, res) => {
  try {
    const playersList = await Player.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "teams",
          localField: "currentClub",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          fullName: {
            $concat: ["$firstName", " ", "$middleName", " ", "$lastName"],
          },
          clubName: { $first: "$result.teamName" },
          playerImageUrl: 1,
          position: 1,
          dob: 1,
          nationality: 1,
        },
      },
      {
        $sort: { fullName: 1 },
      },
    ]);

    return res.status(200).send(playersList);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get the player
router.post("/player/details/:id", async (req, res) => {
  const inputPlayerId = req.params.id;
  try {
    //check mongoid validity
    const resultOfMongoIdValidityCheck = checkMongoIdValidity(inputPlayerId);

    if (!resultOfMongoIdValidityCheck) {
      return res.status(400).send("The MongoId is not valid.");
    }

    const player = await Player.findOne({ _id: inputPlayerId });
    return res.status(200).send(player);
  } catch (error) {
    return res.status(400).send("The player does not exist.");
  }
});

//edit the player
router.put("/player/edit/:id", isAdmin, async (req, res) => {
  const playerIdToEdit = req.params.id;
  const updatePlayer = req.body;

  //check the validity of mongoId.
  const checkPlayerIdToEdit = checkMongoIdValidity(playerIdToEdit);
  if (!checkPlayerIdToEdit) {
    return res.status(400).send("The player id is not valid.");
  }

  // validate the input
  try {
    await playerValidationSchema.validateAsync(updatePlayer);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  //proceed further if input is validated.
  try {
    // find the player existence
    const findPlayer = await Player.findOne({ _id: playerIdToEdit });
    if (!findPlayer) {
      return res.status(400).send("The player does not exist.");
    }

    // update the player
    await Player.updateOne(
      { _id: playerIdToEdit },
      {
        $set: {
          firstName: updatePlayer.firstName,
          middleName: updatePlayer.middleName,
          lastName: updatePlayer.lastName,
          playerImageUrl: updatePlayer.playerImage,
          position: updatePlayer.position,
          dob: updatePlayer.dob,
          nationality: updatePlayer.nationality,
          currentClub: updatePlayer.currentClub,
        },
      }
    );

    return res.status(200).send("The player details is updated successfully.");
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

//delete the player
router.delete("/player/delete/:id", isAdmin, async (req, res) => {
  const playerIdToDelete = req.params.id;
  console.log(playerIdToDelete);

  //check the validity of mongoId.
  const checkPlayerIdToDelete = checkMongoIdValidity(playerIdToDelete);
  if (!checkPlayerIdToDelete) {
    return res.status(400).send("The player id is not valid.");
  }

  // check the player existence
  const findPlayer = await Player.findOne({ _id: playerIdToDelete });
  if (!findPlayer) {
    return res.status(400).send({ message: "The player does not exist." });
  }
  try {
    await Player.deleteOne({ _id: playerIdToDelete });
    return res
      .status(200)
      .send({ success: true, message: "The player is successfully deleted." });
  } catch (error) {
    return res.status(200).send({ success: false, message: error.message });
  }
});

//delete all player - for checking only
router.delete("/players/deleteall", isAdmin, async (req, res) => {
  await Player.deleteMany({});
  return res.status(200).send("All players deleted successfully.");
});

export default router;
