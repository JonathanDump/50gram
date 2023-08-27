import express, { Request, Response } from "express";
import passport from "passport";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", userController.signUp);

router.post("/log-in", userController.logIn);

router.get(
  "/authTest",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => res.json({ msg: "auth success" })
);
module.exports = router;
