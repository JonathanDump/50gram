import express from "express";
import dotenv from "dotenv";
import { envReader } from "./functions/functions";
import passport from "passport";
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
var logger = require("morgan");
const jwtStrategy = require("./strategies/jwt");
const indexRouter = require("./routes/index");
import "./strategies/google";
import bodyParser from "body-parser";

// require("./strategies/google.js");
const session = require("express-session");

const app = express();

app.use(
  session({
    secret: envReader("SESSION_SECRET"),
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/avatars", express.static("avatars"));

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB_KEY;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
