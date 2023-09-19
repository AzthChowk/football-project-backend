import express from "express";
import { Result } from "./result-model.js";
import { Fixture } from "../fixture/fixtureModel.js";
import { resultValidationSchema } from "./result-validation.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { Team } from "../team/teamModel.js";
import { ObjectId } from "mongodb";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { PointTable } from "../point-table/pointTableModel.js";
import {
  checkMatchResult,
  insertAndUpdatePointTable,
} from "../point-table/pointsTableService.js";

const router = express.Router();

// post match result
router.post("/matchresult/create", async (req, res) => {
  const newMatchResult = req.body;
  //validate the inputs
  try {
    await resultValidationSchema.validateAsync(newMatchResult);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  //check whether the match is already posted or not?
  const findMatchNumberExistenceInResult = await Result.findOne({
    matchNumber: newMatchResult.matchNumber,
  });
  if (findMatchNumberExistenceInResult) {
    return res
      .status(400)
      .send({ message: "This match result is already posted." });
  }

  // find whether there is match or not?

  const findMatchNumberExistenceInFixture = await Fixture.findOne({
    matchNumber: newMatchResult.matchNumber,
  });

  if (!findMatchNumberExistenceInFixture) {
    console.log({
      message: `The given match number ${newMatchResult.matchNumber} does not exist.`,
    });
    return res.status(404).send({
      message: `The given match number ${newMatchResult.matchNumber} does not exist.`,
    });
  }

  //check the validity of mongoId
  const checkOpponentOneMongoId = checkMongoIdValidity(
    newMatchResult.opponentOne
  );
  if (!checkOpponentOneMongoId) {
    return res.status(400).send({ message: "Opponent One - Invalid MongoId." });
  }

  // if valid, find whether the team exist or not
  const findOpponentOne = await Team.findOne({
    _id: newMatchResult.opponentOne,
  });

  //if not found, return error
  if (!findOpponentOne) {
    return res
      .status(404)
      .send({ message: "The given first team does not exist." });
  }

  //check the validity of mongoId
  const checkOpponentTwoMongoId = checkMongoIdValidity(
    newMatchResult.opponentTwo
  );
  if (!checkOpponentTwoMongoId) {
    return res.status(400).send({ message: "Opponent Two - Invalid MongoId." });
  }

  // if valid, find whether the team exist or not
  const findOpponentTwo = await Team.findOne({
    _id: newMatchResult.opponentTwo,
  });
  //if not found, return error
  if (!findOpponentTwo) {
    return res
      .status(404)
      .send({ message: "The given second team does not exist." });
  }

  //check the whether the opponent are same as in the fixture or not?
  const opponentOneMongoId = new ObjectId(newMatchResult.opponentOne);
  const opponentTwoMongoId = new ObjectId(newMatchResult.opponentTwo);

  const checkSameTeamOrNot =
    findMatchNumberExistenceInFixture.opponentOne.equals(opponentOneMongoId) &&
    findMatchNumberExistenceInFixture.opponentTwo.equals(opponentTwoMongoId);

  if (!checkSameTeamOrNot) {
    return res.status(400).send({
      message:
        "Either the opponents are not as in the fixture or the match number is mismatched.",
    });
  }

  //check winner

  // if (
  //   newMatchResult.opponentOneGoalScore > newMatchResult.opponentTwoGoalScore
  // ) {
  //   newMatchResult.winnerId = new ObjectId(req.body.opponentOne);
  // }
  // if (
  //   newMatchResult.opponentTwoGoalScore > newMatchResult.opponentOneGoalScore
  // ) {
  //   newMatchResult.winnerId = new ObjectId(req.body.opponentTwo);
  // }

  // check result
  const checkWinner = checkMatchResult(
    newMatchResult.opponentOneGoalScore,
    newMatchResult.opponentTwoGoalScore
  );

  // post the result and update point table
  try {
    // For opponentOne
    insertAndUpdatePointTable(
      newMatchResult.opponentOne,
      newMatchResult.opponentOneGoalScore,
      newMatchResult.opponentTwoGoalScore,
      checkWinner
    );

    // For opponentTwo
    insertAndUpdatePointTable(
      newMatchResult.opponentTwo,
      newMatchResult.opponentTwoGoalScore,
      newMatchResult.opponentOneGoalScore,
      checkWinner
    );

    await Result.create(newMatchResult);
    return res
      .status(201)
      .send({ success: true, message: "Match result is added successfully." });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

// display results
router.get("/results", async (req, res) => {
  try {
    const matchResults = await Result.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "teams",
          localField: "opponentOne",
          foreignField: "_id",
          as: "opponentOneName",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "opponentTwo",
          foreignField: "_id",
          as: "opponentTwoName",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "winnerId",
          foreignField: "_id",
          as: "winnerName",
        },
      },
      {
        $project: {
          _id: 0,
          matchNumber: 1,
          opponentOneName: { $first: "$opponentOneName.teamName" },
          opponentTwoName: { $first: "$opponentTwoName.teamName" },
          winnerName: { $first: "$winnerName.teamName" },
          opponentOneGoalScore: 1,
          opponentTwoGoalScore: 1,
        },
      },
      {
        $sort: {
          matchNumber: 1,
        },
      },
    ]);
    return res.status(200).send(matchResults);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

// delete match result
router.delete("/result/deleteall", async (req, res) => {
  await Result.deleteMany({});
  return res.status(200).send({ message: "All Deleted." });
});

//edit match result
router.put("/result/edit/:id", isAdmin, async (req, res) => {
  const editResultId = req.params.id;
  const updateResult = req.body;
  console.log(editResultId);

  //validate input
  try {
    await resultValidationSchema.validateAsync(updateResult);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  // check MongoId
  const checkEditResultIdMongoIdValidity = checkMongoIdValidity(editResultId);
  if (!checkEditResultIdMongoIdValidity) {
    return res
      .status(400)
      .send({ message: "The given input id is not valid id." });
  }

  //check the result existence
  const findResult = await Result.findOne({ _id: editResultId });
  if (!findResult) {
    return res
      .status(400)
      .send({ message: "The given result id does not exist." });
  }
  try {
    await Result.updateOne(
      { _id: editResultId },
      {
        $set: {
          isMatchFinished: updateResult.isMatchFinished,
          matchNumber: updateResult.matchNumber,
          opponentOne: updateResult.opponentOne,
          opponentTwo: updateResult.opponentTwo,
          opponentOneGoalScore: updateResult.opponentOneGoalScore,
          opponentTwoGoalScore: updateResult.opponentTwoGoalScore,
        },
      }
    );

    return res
      .status(200)
      .send({ message: "The match result is updated successfully." });
  } catch (error) {}
});

//delete match result
router.delete("/result/delete/:id", isAdmin, async (req, res) => {
  const deleteResultId = req.params.id;
  console.log(deleteResultId);

  // check MongoId
  const checkDeleteResultIdMongoIdValidity =
    checkMongoIdValidity(deleteResultId);
  if (!checkDeleteResultIdMongoIdValidity) {
    return res
      .status(400)
      .send({ message: "The given input id is not valid id." });
  }

  //check the result existence
  const findResult = await Result.findOne({ _id: deleteResultId });
  if (!findResult) {
    return res
      .status(400)
      .send({ message: "The given result id does not exist." });
  }

  // perform delete operation
  try {
    await Result.deleteOne({ _id: deleteResultId });
    return res
      .status(200)
      .send({ message: "The result is deleted successfully." });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

export default router;
