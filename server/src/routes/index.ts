import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();
const userController = require("../controllers/userController");
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars");
  },
  filename: function (req, file, cb) {
    // console.log(file);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
    console.log(filename);

    // req.body.imgName = filename;
    cb(null, filename);
  },
});
export const upload = multer({ storage: storage });

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", upload.single("avatar"), userController.signUp);
router.post("/sign-up/google", userController.signUpGoogle);

router.post("/log-in/jwt", userController.logIn);

router.get("/log-in/google", passport.authenticate("google"));
router.get(
  "/auth/google",
  passport.authenticate("google", {
    successRedirect: "/50gram",
    // failureRedirect: "/log-in",
  })
);

router.get("/log-out", (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return next(err);
    }
    res.json({ isSuccess: true });
  });
});

router.use("/50gram", require("./fiftyGram"));

module.exports = router;
