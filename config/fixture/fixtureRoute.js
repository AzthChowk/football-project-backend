import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { fixtureValidateSchema } from "./fixtureValidate.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import mongoose from "mongoose";

import { Team } from "../team/teamModel.js";
import { Fixture } from "./fixtureModel.js";
import {
  checkMongoIdAndOpponentExistence,
  validateEditInput,
} from "./fixtureService.js";

const router = express.Router();

//create fixture
router.post("/fixture/create", isAdmin, async (req, res) => {
  const newFixture = req.body;

  const checkMatchNumber = await Fixture.findOne({
    matchNumber: newFixture.matchNumber,
  });
  if (checkMatchNumber) {
    return res
      .status(400)
      .send({ message: "The given match number already exist." });
  }

  // validate the input
  try {
    await fixtureValidateSchema.validateAsync(newFixture);
  } catch (error) {
    return res.status(400).send(error.message);
  }
  //check the validity of mongoId
  const checkOpponentOneMongoId = checkMongoIdValidity(newFixture.opponentOne);
  if (!checkOpponentOneMongoId) {
    return res.status(400).send({ message: "Invalid MongoId." });
  }
  // if valid, find whether the team exist or not
  const findOpponentOne = await Team.findOne({ _id: newFixture.opponentOne });
  //if not found, return error
  if (!findOpponentOne) {
    return res
      .status(404)
      .send({ message: "The given first team does not exist." });
  }

  //check the validity of mongoId
  const checkOpponentTwoMongoId = checkMongoIdValidity(newFixture.opponentTwo);
  if (!checkOpponentTwoMongoId) {
    return res.status(400).send("Invalid MongoId.");
  }
  // if valid, find whether the team exist or not
  const findOpponentTwo = await Team.findOne({ _id: newFixture.opponentTwo });
  //if not found, return error
  if (!findOpponentTwo) {
    return res
      .status(404)
      .send({ message: "The given second team does not exist." });
  }

  // check whether the teams are different or not?
  if (newFixture.opponentOne === newFixture.opponentTwo) {
    return res
      .status(400)
      .send({ message: "Opponent teams cannot be same team." });
  }
  try {
    await Fixture.create(newFixture);
    return res.status(201).send({
      success: true,
      message: "New match is created successfully.",
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
        _id: 1,
        matchNumber: 1,
        matchStage: 1,
        opponentOneName: { $first: "$opponentOneRes.teamName" },
        opponentOneLogo: { $first: "$opponentOneRes.teamLogo" },
        opponentTwoName: { $first: "$opponentTwoRes.teamName" },
        opponentTwoLogo: { $first: "$opponentTwoRes.teamLogo" },
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
      $limit: 7,
    },
    {
      $project: {
        _id: 1,
        matchNumber: 1,
        opponentOneName: { $first: "$opponentOneRes.teamName" },
        opponentOneLogo: { $first: "$opponentOneRes.teamLogo" },
        opponentTwoName: { $first: "$opponentTwoRes.teamName" },
        opponentTwoLogo: { $first: "$opponentTwoRes.teamLogo" },
        time: 1,
        date: 1,
        playGround: 1,
      },
    },
  ]);
  return res.status(200).send(fixtureList);
});

// get the fixture - up coming
router.get("/fixture/:id", async (req, res) => {
  const matchId = req.params.id;
  const fixtureDetail = await Fixture.findOne({ _id: matchId });
  return res.status(200).send(fixtureDetail);
});

// delete fixture
router.delete("/fixture/delete/:id", isAdmin, async (req, res) => {
  try {
    const inputFixtureIdToDelete = req.params.id;
    console.log(inputFixtureIdToDelete);

    //check the mongo id validity for input
    const checkInputFixtureIdToDeleteMongoId = checkMongoIdValidity(
      inputFixtureIdToDelete
    );
    if (!checkInputFixtureIdToDeleteMongoId) {
      return res.status(400).send("The input id is not valid Id.");
    }

    //find the match existence
    const findDeleteFixture = await Fixture.findOne({
      _id: inputFixtureIdToDelete,
    });
    if (!findDeleteFixture) {
      return res
        .status(404)
        .send("The match with the given id does not exist.");
    }
    await Fixture.deleteOne({ _id: inputFixtureIdToDelete });
    return res
      .status(200)
      .send({ success: true, message: "The fixture is deleted successfully." });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

// delete fixture all
router.delete("/fixture/deleteall", isAdmin, async (req, res) => {
  await Fixture.deleteMany({});
  return res.status(200).send("The fixture is deleted successfully.");
});

// edit fixture
router.put(
  "/fixture/edit/:id",
  isAdmin,
  validateEditInput,
  checkMongoIdAndOpponentExistence,
  async (req, res) => {
    const updateFixture = req.body;
    await Fixture.updateOne(
      { _id: req.params.id },
      {
        $set: {
          matchNumber: updateFixture.matchNumber,
          time: updateFixture.time,
          date: updateFixture.date,
          playGround: updateFixture.playGround,
          opponentOne: updateFixture.opponentOne,
          opponentTwo: updateFixture.opponentTwo,
        },
      }
    );
    return res.status(200).send("The Match is successfully updated.");
  }
);

export default router;
