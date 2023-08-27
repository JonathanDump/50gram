import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
const userController = require("../controllers/userController");

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log("auth req.user", req.user);
  req.user ? next() : res.status(401).json({ msg: "failed to auth" });
};

router.use("/", authenticate);

router.get("/", userController.getAllUsers);

router.get("/chat", (req: Request, res: Response, next: NextFunction) =>
  res.json({ msg: "chat" })
);

module.exports = router;
