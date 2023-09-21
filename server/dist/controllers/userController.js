"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envReader_1 = __importDefault(require("../functions/envReader"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const otplib_1 = require("otplib");
otplib_1.totp.options = { step: 60 };
const sendOtp_1 = __importDefault(require("../functions/sendOtp"));
const generateJwt_1 = __importDefault(require("../functions/generateJwt"));
const nodemailer = require("nodemailer");
exports.signUp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email: req.body.email }).exec();
    if (user) {
        res.json({ isExist: true });
    }
    else {
        bcrypt_1.default.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(err);
            }
            const user = new user_1.default({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                img: req.file
                    ? `${(0, envReader_1.default)("CORS_ORIGIN")}/avatars/${req.file.filename}`
                    : `${(0, envReader_1.default)("CORS_ORIGIN")}/avatars/default-avatar.jpeg`,
            });
            yield user.save();
            res.json({
                user: { _id: user._id, name: user.name, img: user.img },
                isSuccess: true,
            });
        }));
    }
}));
exports.signUpGoogle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = {};
    opts.expiresIn = "100d";
    const secret = (0, envReader_1.default)("SECRET_KEY");
    const user = yield user_1.default.findOne({ email: req.body.email }).exec();
    if (user) {
        const token = yield jsonwebtoken_1.default.sign({ user }, secret, opts);
        res
            .status(200)
            .json({ token: `Bearer ${token}`, myId: user._id, isSuccess: true });
    }
    else {
        const user = new user_1.default({
            name: req.body.name,
            email: req.body.email,
            img: req.body.img
                ? req.body.img
                : `${(0, envReader_1.default)("CORS_ORIGIN")}/avatars/default-avatar.jpeg`,
        });
        yield user.save();
        const token = yield jsonwebtoken_1.default.sign({
            user: {
                name: user.name,
                email: user.email,
                img: user.img,
                _id: user._id,
            },
        }, secret, opts);
        res.status(200).json({
            token: `Bearer ${token}`,
            user: { name: user.name, _id: user._id, img: user.img },
            isSuccess: true,
        });
    }
}));
exports.logIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email }).exec();
    if (!user) {
        res.json({ invalid: { email: true, password: false } });
        next();
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.json({ invalid: { password: true, email: false } });
        next();
    }
    const opts = {};
    opts.expiresIn = "100d";
    const secret = (0, envReader_1.default)("SECRET_KEY");
    const token = yield jsonwebtoken_1.default.sign({
        user: {
            name: user.name,
            email: user.email,
            img: user.img,
            _id: user._id,
        },
    }, secret, opts);
    res.status(200).json({ token: `Bearer ${token}` });
}));
exports.logInVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email }).exec();
    if (!user) {
        res.json({ invalid: { email: true, password: false } });
        next();
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.json({ invalid: { password: true, email: false } });
        next();
    }
    const sendOtpResult = yield (0, sendOtp_1.default)(email);
    if (!sendOtpResult) {
        res.status(400).json({ isSuccess: false });
        next();
    }
    res.status(200).json({ isSuccess: true });
}));
exports.otpVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const isValid = otplib_1.totp.check(otp, process.env.OTP_SECRET);
    if (!isValid) {
        res.status(400).json({ invalidOtpToken: true });
        next();
    }
    const user = yield user_1.default.findOne({ email }).exec();
    const jwtToken = yield (0, generateJwt_1.default)(user, "100d");
    res.status(200).json({ token: `Bearer ${jwtToken}` });
}));
exports.updateUserInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.body.id).exec();
    if (!user) {
        throw new Error("Couldn't find the user");
    }
    if (user) {
        req.body.name && (user.name = req.body.name);
        req.file &&
            (user.img = `${(0, envReader_1.default)("CORS_ORIGIN")}/avatars/${req.file.filename}`);
        yield user.save();
        const opts = {};
        opts.expiresIn = "100d";
        const secret = (0, envReader_1.default)("SECRET_KEY");
        const jwtToken = yield jsonwebtoken_1.default.sign({
            user: {
                name: user.name,
                email: user.email,
                img: user.img,
                _id: user._id,
            },
        }, secret, opts);
        res.status(200).json({ token: `Bearer ${jwtToken}` });
    }
}));
exports.getNewJwt = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedJwt = (0, jwt_decode_1.default)(req.headers.authorization);
    const opts = {};
    opts.expiresIn = "100d";
    const secret = (0, envReader_1.default)("SECRET_KEY");
    const jwtToken = yield jsonwebtoken_1.default.sign({
        user: {
            name: decodedJwt.user.name,
            email: decodedJwt.user.email,
            img: decodedJwt.user.img,
            _id: decodedJwt.user._id,
        },
    }, secret, opts);
    res.status(200).json({ token: `Bearer ${jwtToken}` });
}));
