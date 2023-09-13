import express from "express";
import { Result } from "./result-model.js";
import { Fixture } from "../fixture/fixtureModel.js";
import { resultValidationSchema } from "./result-validation.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { Team } from "../team/teamModel.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// post match result
router.post("/matchresult/add", async (req, res) => {
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
    return res.status(400).send("This match result is already posted.");
  }

  // find whether there is match or not?

  const findMatchNumberExistenceInFixture = await Fixture.findOne({
    matchNumber: newMatchResult.matchNumber,
  });

  if (!findMatchNumberExistenceInFixture) {
    console.log(
      `The given match number ${newMatchResult.matchNumber} does not exist.`
    );
    return res
      .status(404)
      .send(
        `The given match number ${newMatchResult.matchNumber} does not exist.`
      );
  }

  //check the validity of mongoId
  const checkOpponentOneMongoId = checkMongoIdValidity(
    newMatchResult.opponentOne
  );
  if (!checkOpponentOneMongoId) {
    return res.status(400).send("Opponent One - Invalid MongoId.");
  }

  // if valid, find whether the team exist or not
  const findOpponentOne = await Team.findOne({
    _id: newMatchResult.opponentOne,
  });

  //if not found, return error
  if (!findOpponentOne) {
    return res.status(404).send("The given first team does not exist.");
  }

  //check the validity of mongoId
  const checkOpponentTwoMongoId = checkMongoIdValidity(
    newMatchResult.opponentTwo
  );
  if (!checkOpponentTwoMongoId) {
    return res.status(400).send("Opponent Two - Invalid MongoId.");
  }

  // if valid, find whether the team exist or not
  const findOpponentTwo = await Team.findOne({
    _id: newMatchResult.opponentTwo,
  });
  //if not found, return error
  if (!findOpponentTwo) {
    return res.status(404).send("The given second team does not exist.");
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
  console.log(
    newMatchResult.opponentTwoGoalScore > newMatchResult.opponentOneGoalScore
  );
  if (
    newMatchResult.opponentOneGoalScore > newMatchResult.opponentTwoGoalScore
  ) {
    newMatchResult.winnerId = new ObjectId(req.body.opponentOne);
  }
  if (
    newMatchResult.opponentTwoGoalScore > newMatchResult.opponentOneGoalScore
  ) {
    newMatchResult.winnerId = new ObjectId(req.body.opponentTwo);
  }
  console.log(newMatchResult);
  await Result.create(newMatchResult);
  return res
    .status(201)
    .send({ success: true, message: "Match result is successfully added." });
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
          opponentOneName: { $first: "$opponentOneName.name" },
          opponentTwoName: { $first: "$opponentTwoName.name" },
          winnerName: { $first: "$winnerName.name" },
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
router.delete("/result/delete", async (req, res) => {
  await Result.deleteMany({});
  return res.status(200).send("All Deleted.");
});
export default router;
