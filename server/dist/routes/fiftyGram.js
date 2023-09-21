"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageMessage = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const _1 = require(".");
const router = express_1.default.Router();
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/pictures");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
        cb(null, filename);
    },
});
exports.uploadImageMessage = (0, multer_1.default)({ storage: storage });
router.use("/", passport_1.default.authenticate("jwt", { session: false }));
router.post("/:userId", chatController.getChat);
router.post("/:userId/sendImageMessage", exports.uploadImageMessage.single("image"), chatController.sendImageMessage);
router.post("/:userId/sendMessage", _1.upload.none(), chatController.sendMessage);
router.put("/user/update", _1.upload.single("avatar"), userController.updateUserInfo);
module.exports = router;
