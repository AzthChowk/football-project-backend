import express from "express";
import dotenv from "dotenv";
import connectDB from "./dbconnect.js";
import cors from "cors";
import adminRouter from "./config/admin/adminRoute.js";
import pointTableRouter from "./config/point-table/pointsTableRoute.js";
import teamRouter from "./config/team/teamRoute.js";
import playerRoute from "./config/player/playerRoute.js";
import newsRoute from "./config/news/newsRoute.js";
import groupRoute from "./config/group/group-route.js";

// configure dotenv -- important
dotenv.config();

//DATABASE CONNECT
connectDB();

//REST OBJECT
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

//USE ROUTES
app.use(adminRouter);
// app.use(pointTableRouter);
app.use(teamRouter);
app.use(playerRoute);
app.use(pointTableRouter);
app.use(newsRoute);
app.use(groupRoute);

//PORT
const PORT = process.env.PORT || 9090;

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Expose-Headers", "accessToken, refreshToken,");
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET, OPTIONS"
    );
    return res.status(200).json({});
  }

  return next();
});

//GET
app.get("/", (req, res) => {
  res.status(200).send("<h2>Football Tournament</h2>");
});

//LISTEN
app.listen(PORT, (req, res) => {
  console.log(
    `SERVER IS RUNNING ON ${process.env.DEV_MODE} MODE ON PORT ${PORT}.`
  );
});
