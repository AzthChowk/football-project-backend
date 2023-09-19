import { PointTable } from "./pointTableModel.js";

export const insertAndUpdatePointTable = async (id, gf, ga, checkWinner) => {
  const gd = gf - ga;
  const pts = calculatePoints(gf, ga);
  const winCount = calculateWin(gf, ga);
  const drawCount = calculateDraw(gf, ga);
  const lossCount = calculateLoss(gf, ga);
  console.log(pts);

  // find whether the team existence in point table
  const findTeam = await PointTable.findOne({ teamId: id });
  if (!findTeam) {
    const createTeamPoint = await PointTable.create({
      teamId: id,
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goalFor: 0,
      goalAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  // if team exist
  const updateTeamPoints = await PointTable.updateOne(
    { teamId: id },
    {
      $inc: {
        played: 1,
        win: winCount,
        draw: drawCount,
        loss: lossCount,
        goalFor: gf,
        goalAgainst: ga,
        goalDifference: gd,
        points: pts,
      },
    }
  );
};

export const checkMatchResult = (opponentOneGoal, opponentTwoGoal) => {
  let result = "";
  if (opponentOneGoal > opponentTwoGoal) {
    result = "opponentOneWins";
  } else if (opponentTwoGoal > opponentOneGoal) {
    result = "opponentTwoWins";
  } else {
    result = "draw";
  }
  return result;
};

// calcutate pts

const calculatePoints = (goalFor, goalAgainst) => {
  let ptsCalc = "";
  if (goalFor > goalAgainst) {
    ptsCalc = 3;
  } else if (goalAgainst > goalFor) {
    ptsCalc = 0;
  } else {
    ptsCalc = 1;
  }
  return ptsCalc;
};

const calculateWin = (goalFor, goalAgainst) => {
  let winCalc = "";
  if (goalFor > goalAgainst) {
    winCalc = 1;
  } else if (goalAgainst > goalFor) {
    winCalc = 0;
  } else {
    winCalc = 0;
  }
  return winCalc;
};

const calculateDraw = (goalFor, goalAgainst) => {
  let drawCalc = "";
  if (goalFor > goalAgainst) {
    drawCalc = 0;
  } else if (goalAgainst > goalFor) {
    drawCalc = 0;
  } else {
    drawCalc = 1;
  }
  return drawCalc;
};

const calculateLoss = (goalFor, goalAgainst) => {
  let lossCalc = "";
  if (goalFor > goalAgainst) {
    lossCalc = 0;
  } else if (goalAgainst > goalFor) {
    lossCalc = 1;
  } else {
    lossCalc = 0;
  }
  return lossCalc;
};
