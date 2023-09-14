import { checkMongoIdValidity } from "../../utils/utils.js";
import { Team } from "../team/teamModel.js";
import { Fixture } from "./fixtureModel.js";
import { fixtureValidateSchema } from "./fixtureValidate.js";

export const checkMongoIdAndOpponentExistence = async (req, res, next) => {
  //check the validity of mongoId
  const checkOpponentOneMongoId = checkMongoIdValidity(req.body.opponentOne);
  if (!checkOpponentOneMongoId) {
    return res.status(400).send("Opponent One - Invalid MongoId.");
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
    return res.status(400).send("Opponent Two - Invalid MongoId.");
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
  next();
};

//validate input

export const validateEditInput = async (req, res, next) => {
  const editInput = req.body;
  console.log(editInput);

  // Check the validity of input id.
  const checkEditInputMongoId = checkMongoIdValidity(req.params.id);
  if (!checkEditInputMongoId) {
    return res.status(400).send("The input id for edit is not valid Mongo Id.");
  }

  // find whether the match exist or not?
  const findMatchExistence = await Fixture.findOne({ _id: req.params.id });
  if (!findMatchExistence) {
    return res.status(404).send("The match with the given id does not exist.");
  }

  try {
    await fixtureValidateSchema.validateAsync(editInput);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  next();
};
