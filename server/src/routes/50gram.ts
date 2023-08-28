import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log("auth req.user", req.user);
  req.user ? next() : res.status(401).json({ msg: "failed to auth" });
};

// router.use("/", authenticate);

router.get("/", userController.getAllUsers);

router.post("/:userId", chatController.getChat);

router.post("/:userId/sendMessage", chatController.sendMessage);

module.exports = router;
