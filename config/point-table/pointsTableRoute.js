import express from "express";
import { PointTable } from "./pointTableModel.js";

const router = express.Router();

// POST
router.post("/points/insert", async (req, res) => {
  const pointToInsert = req.body;
  console.log(pointToInsert);
  try {
    await PointTable.create(pointToInsert);
    res.status(201).send({
      success: true,
      message: "POINTS INSERTED SUCCESSFULLY.",
    });
  } catch (error) {
    console.log({
      success: false,
      message: "FAILED, CANNOT INSERT DATA.",
    });
    res.status(400).send({
      success: false,
      message: "FAILED, CANNOT INSERT DATA.",
    });
  }
});

// GET
router.get("/points/table", async (req, res) => {
  try {
    const pointTableData = await PointTable.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "teamLookupResult",
        },
      },
      {
        $project: {
          _id: 0,
          teamName: { $first: "$teamLookupResult.teamName" },
          teamLogo: { $first: "$teamLookupResult.teamLogo" },
          played: 1,
          win: 1,
          draw: 1,
          loss: 1,
          goalFor: 1,
          goalAgainst: 1,
          goalDifference: 1,
          points: 1,
          teamId: 1,
        },
      },
      {
        $sort: { points: -1, played: 1, goalDifference: -1, goalFor: -1 },
      },
    ]);
    res.status(200).send(pointTableData);
  } catch (error) {
    console.log({
      success: false,
      message: "ERROR, CANNOT GET THE DATA.",
    });
    res.status(400).send({
      success: false,
      message: "ERROR, CANNOT GET THE DATA.",
    });
  }
});

// point table all delete
router.delete("/pointstable/deleteall", async (req, res) => {
  try {
    await PointTable.deleteMany({});
    res.status(200).send("All Deleted");
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
