import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { fixtureValidateSchema } from "./fixtureValidate.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import mongoose from "mongoose";

import { Team } from "../team/teamModel.js";
import { Fixture } from "./fixtureModel.js";

const router = express.Router();

router.post("/fixture/create", isAdmin, async (req, res) => {
  const newFixture = req.body;
  // validate the input
  try {
    await fixtureValidateSchema.validateAsync(newFixture);
  } catch (error) {
    return res.status(400).send(error.message);
  }
  //check the validity of mongoId
  const checkOpponentOneMongoId = checkMongoIdValidity(req.body.opponentOne);
  if (!checkOpponentOneMongoId) {
    return res.status(400).send("Invalid MongoId.");
  }
  // if valid, find whether the team exist or not
  const findOpponentOne = await Team.findOne({ _id: req.body.opponentOne });
  //if not found, return error
  if (!findOpponentOne) {
    return res.status(404).send("The given first team does not exist.");
  }

  //check the validity of mongoId
  const checkOpponentTwoMongoId = checkMongoIdValidity(req.body.opponentTwo);
  if (!checkOpponentTwoMongoId) {
    return res.status(400).send("Invalid MongoId.");
  }
  // if valid, find whether the team exist or not
  const findOpponentTwo = await Team.findOne({ _id: req.body.opponentTwo });
  //if not found, return error
  if (!findOpponentTwo) {
    return res.status(404).send("The given second team does not exist.");
  }

  // check whether the teams are different or not?
  if (req.body.opponentOne === req.body.opponentTwo) {
    return res.status(400).send("Opponent teams cannot be same team.");
  }
  try {
    await Fixture.create(newFixture);
    return res.status(201).send({
      success: true,
      message: "New Fixture created successfully.",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

// get the fixture
router.post("/fixtures", async (req, res) => {
  const fixtureList = await Fixture.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "teams",
        localField: "opponentOne",
        foreignField: "_id",
        as: "opponentOneRes",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "opponentTwo",
        foreignField: "_id",
        as: "opponentTwoRes",
      },
    },
    {
      $project: {
        _id: 0,
        matchNumber: 1,
        opponentOneName: { $first: "$opponentOneRes.name" },
        opponentOneLogo: { $first: "$opponentOneRes.logo" },
        opponentTwoName: { $first: "$opponentTwoRes.name" },
        opponentTwoLogo: { $first: "$opponentTwoRes.logo" },
        time: 1,
        date: 1,
        playGround: 1,
      },
    },
  ]);
  return res.status(200).send(fixtureList);
});

// get the fixture - up coming
router.post("/fixtures/upcoming", async (req, res) => {
  const fixtureList = await Fixture.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "teams",
        localField: "opponentOne",
        foreignField: "_id",
        as: "opponentOneRes",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "opponentTwo",
        foreignField: "_id",
        as: "opponentTwoRes",
      },
    },
    {
      $project: {
        _id: 0,
        matchNumber: 1,
        opponentOneName: { $first: "$opponentOneRes.name" },
        opponentOneLogo: { $first: "$opponentOneRes.logo" },
        opponentTwoName: { $first: "$opponentTwoRes.name" },
        opponentTwoLogo: { $first: "$opponentTwoRes.logo" },
        time: 1,
        date: 1,
        playGround: 1,
      },
    },
  ]);
  return res.status(200).send(fixtureList);
});

export default router;
