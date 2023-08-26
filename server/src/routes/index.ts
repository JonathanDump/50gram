import express, { Request, Response } from "express";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", userController.SignUp);

module.exports = router;
