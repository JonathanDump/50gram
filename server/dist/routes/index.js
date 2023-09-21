"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const userController = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: "public/avatars",
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
        cb(null, filename);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
router.get("/", (req, res) => {
    res.send("Express + TypeScript Server11");
});
router.post("/sign-up", exports.upload.single("avatar"), userController.signUp);
router.post("/sign-up/google", userController.signUpGoogle);
router.post("/log-in/jwt", userController.logInVerify);
router.post("/log-in/otp", userController.otpVerify);
router.get("/log-in/google", passport_1.default.authenticate("google"));
router.get("/auth/google", passport_1.default.authenticate("google", {
    successRedirect: "/50gram",
}));
router.get("/log-out", (req, res, next) => {
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
