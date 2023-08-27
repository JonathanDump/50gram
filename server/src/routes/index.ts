import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", userController.signUp);

router.post("/log-in/jwt", userController.logIn);
router.get(
  "/auth/jwt",
  passport.authenticate("jwt", {
    successRedirect: "/50gram",
    // failureRedirect: "/log-in",
  })
);

router.get("/log-in/google", passport.authenticate("google"));
router.get(
  "/auth/google",
  passport.authenticate("google", {
    successRedirect: "/50gram",
    // failureRedirect: "/log-in",
  })
);

router.use("/50gram", require("./50gram"));

module.exports = router;
