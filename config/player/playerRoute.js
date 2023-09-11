import { Player } from "./playerModel.js";
import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import Joi from "joi";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { playerValiditySchema } from "./player-validation.js";
import { Team } from "../team/teamModel.js";

import mongoose from "mongoose";
const router = express.Router();

//CREATE
router.post("/player/create", isAdmin, async (req, res) => {
  const newPlayer = req.body;
  try {
    const validatePlayer = await playerValiditySchema.validateAsync(newPlayer);
    if (!validatePlayer) return res.status(400).send("Error on Validation.");
    const findCurrentClubExistence = await Team.findOne({
      _id: validatePlayer.currentClub,
    });

    if (!findCurrentClubExistence)
      return res.status(400).send("No Team found.");
    await Player.create(newPlayer);
    return res.status(201).send("Player added successfully.");
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
          clubName: { $first: "$result.name" },
          playerImage: 1,
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
router.post("/player/:id", async (req, res) => {
  const inputPlayerId = req.params.id;

  //check mongoid validiity
  const resultOfMongoIdValidityCheck = checkMongoIdValidity(inputPlayerId);

  if (!resultOfMongoIdValidityCheck) {
    return res.status(400).send("The MongoId is not valid.");
  }

  try {
    const teamName = await Player.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(inputPlayerId),
        },
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
          firstName: 1,
          clubName: { $first: "$result.name" },
        },
      },
    ]);

    console.log("hi", teamName);
    console.log(teamName[0].result);

    // const teamName = await Team.findOne({ _id: player.currentClub });
    // console.log(teamName.name);
    // player.currentClub = teamName.name;
    return res.status(200).send(player);
  } catch (error) {
    return res.status(400).send("The player does not exist.");
  }
});

export default router;

// [
//   {
//     $match: {
//       _id: ObjectId("64e9676062727a6f0c209fdf"),
//     },
//   },
//   {
//     $lookup: {
//       from: "teams",
//       localField: "currentClub",
//       foreignField: "_id",
//       as: "result",
//     },
//   },
//   {
//     $project: {
//       fullname: {
//         $concat: ["$firstName", " ", "$middleName", " ", "$lastName"],
//       },
//       clubName: { $first: "$result.name" },
//     },
//   },
// ];
