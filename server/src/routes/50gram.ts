import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { upload } from ".";
const router = express.Router();
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");

router.use("/", passport.authenticate("jwt", { session: false }));

// router.get("/", userController.getAllUsers);

router.get("/:userId", chatController.getChat);

router.post("/:userId/sendMessage", upload.none(), chatController.sendMessage);

router.put(
  "/user/update",
  upload.single("avatar"),
  userController.updateUserInfo
);
module.exports = router;
