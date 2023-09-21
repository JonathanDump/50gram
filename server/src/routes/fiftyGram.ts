import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { upload } from ".";
const router = express.Router();
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");
import multer from "multer";

const storage = multer.diskStorage({
  destination: "public/pictures",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];

    cb(null, filename);
  },
});
export const uploadImageMessage = multer({ storage: storage });

router.use("/", passport.authenticate("jwt", { session: false }));

router.post("/:userId", chatController.getChat);

router.post(
  "/:userId/sendImageMessage",

  uploadImageMessage.single("image"),
  chatController.sendImageMessage
);

router.put(
  "/user/update",

  upload.single("avatar"),
  userController.updateUserInfo
);
module.exports = router;
