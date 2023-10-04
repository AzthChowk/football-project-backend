import { ObjectId } from "mongodb";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { Fixture } from "../fixture/fixtureModel.js";
import {
  checkMatchResult,
  insertAndUpdatePointTable,
} from "../point-table/pointsTableService.js";
import { Team } from "../team/teamModel.js";
import { Result } from "./result-model.js";
import { resultValidationSchema } from "./result-validation.js";

export const createResult = async (req, res) => {
  const newMatchResult = req.body;
  console.log(newMatchResult);
  //validate the inputs
  try {
    await resultValidationSchema.validateAsync(newMatchResult);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  //check whether the match is already posted or not?
  const findMatchIdExistenceInResult = await Result.findOne({
    matchId: newMatchResult.matchId,
  });
  if (findMatchIdExistenceInResult) {
    return res
      .status(400)
      .send({ message: "This match result is already posted." });
  }

  //check the validity of mongoId
  const checkMatchIdMongoIdValidity = checkMongoIdValidity(
    newMatchResult.matchId
  );
  if (!checkMatchIdMongoIdValidity) {
    return res.status(400).send({ message: "Match Id - Invalid MongoId." });
  }
  // find whether there is match or not?

  const findMatchIdExistenceInFixture = await Fixture.findOne({
    _id: newMatchResult.matchId,
  });

  if (!findMatchIdExistenceInFixture) {
    return res.status(404).send({
      message: `The given match number ${newMatchResult.matchId} does not exist.`,
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
    findMatchIdExistenceInFixture.opponentOne.equals(opponentOneMongoId) &&
    findMatchIdExistenceInFixture.opponentTwo.equals(opponentTwoMongoId);

  if (!checkSameTeamOrNot) {
    return res.status(400).send({
      message:
        "Either the opponents are not as in the fixture or the match number is mismatched.",
    });
  }

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
      newMatchResult.opponentTwoGoalScore
    );

    // For opponentTwo
    insertAndUpdatePointTable(
      newMatchResult.opponentTwo,
      newMatchResult.opponentTwoGoalScore,
      newMatchResult.opponentOneGoalScore
    );

    await Result.create(newMatchResult);
    return res
      .status(201)
      .send({ success: true, message: "Match result is added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: "error.message" });
  }
};
