import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", userController.signUp);

// router.get("/log-in", (req: Request, res: Response) =>
//   res.json({ msg: "pls log-in" })
// );
router.post("/log-in/jwt", userController.logIn);

router.get("/log-in/google", passport.authenticate("google"));
router.get(
  "/google/auth",
  passport.authenticate("google", {
    successRedirect: "/50gram",
    failureRedirect: "/log-in",
  })
);
// router.get(
//   "/50gram",
//   // passport.authenticate("jwt", { session: false }),
//   (req: Request, res: Response) => res.json({ msg: "auth success" })
// );

router.get("/50gram", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);

  req.user
    ? res.json({ msg: "Welcome to 50gram" })
    : res.status(401).json({ msg: "not Allowed" });
});

module.exports = router;
