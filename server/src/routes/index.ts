import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
const userController = require("../controllers/userController");
import multer from "multer";

const storage = multer.diskStorage({
  destination: "public/avatars",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];

    cb(null, filename);
  },
});
export const upload = multer({ storage: storage });

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

router.post("/sign-up", upload.single("avatar"), userController.signUp);
router.post("/sign-up/google", userController.signUpGoogle);

router.post("/log-in/jwt", userController.logInVerify);
router.post("/log-in/otp", userController.otpVerify);

router.get("/log-out", (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return next(err);
    }
    res.json({ isSuccess: true });
  });
});

router.get("/get-new-jwt", userController.getNewJwt);

router.use("/50gram", require("./fiftyGram"));

module.exports = router;
