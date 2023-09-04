import express from "express";
import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
var logger = require("morgan");
require("./strategies/jwt");
const indexRouter = require("./routes/index");
import { createServer } from "http";
import { Server } from "socket.io";
import socketHandler from "./socket/socket";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

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

socketHandler(io);

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
