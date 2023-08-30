import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");

// const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   console.log(" req", req);
//   req.user ? next() : res.status(401).json({ msg: "failed to auth" });
// };

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    passport.authenticate("jwt", (err: any, user: any) => {
      err ? next(err) : next();
    })(req, res, next);
  } else {
    req.user ? next() : res.status(401).json({ msg: "failed to auth" });
  }
};

router.use(
  "/",
  passport.authenticate("jwt", { session: false })

  // authenticate
);

router.get("/", userController.getAllUsers);

router.post("/:userId", chatController.getChat);

router.post("/:userId/sendMessage", chatController.sendMessage);

module.exports = router;
