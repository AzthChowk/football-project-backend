import express from "express";
import { pointTable } from "./pointTableModel.js";

const router = express.Router();

// POST
router.post("/points/insert", async (req, res) => {
  const pointToInsert = req.body;
  console.log(pointToInsert);
  try {
    await pointTable.create(pointToInsert);
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
    const pointTableData = await pointTable.find();
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

export default router;
