import express from "express";
import { isAdmin } from "../../auth/authorization-middleware.js";
import { checkMongoIdValidity } from "../../utils/utils.js";
import { Result } from "./result-model.js";
import { createResult } from "./result-service.js";
import { resultValidationSchema } from "./result-validation.js";

const router = express.Router();

// post match result
router.post("/matchresult/create", createResult);

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
        $lookup: {
          from: "fixtures",
          localField: "matchId",
          foreignField: "_id",
          as: "fixtureDetails",
        },
      },
      {
        $project: {
          _id: 0,
          opponentOneName: { $first: "$opponentOneName.teamName" },
          opponentTwoName: { $first: "$opponentTwoName.teamName" },
          opponentOneLogo: { $first: "$opponentOneName.teamLogo" },
          opponentTwoLogo: { $first: "$opponentTwoName.teamLogo" },
          matchNumber: { $first: "$fixtureDetails.matchNumber" },
          playGround: { $first: "$fixtureDetails.playGround" },
          time: { $first: "$fixtureDetails.time" },
          date: { $first: "$fixtureDetails.date" },
          matchStage: { $first: "$fixtureDetails.matchStage" },
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
          matchId: updateResult.matchId,
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
