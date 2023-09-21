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
Object.defineProperty(exports, "__esModule", { value: true });
const otplib_1 = require("otplib");
const nodemailer = require("nodemailer");
function sendOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.OTP_SECRET;
        const optToken = otplib_1.totp.generate(secret);
        const message = `Your 2Auth code
    ${optToken}
    Don't tell it anybody`;
        const transporter = nodemailer.createTransport({
            host: "smtp.ukr.net",
            port: 465,
            secure: true,
            auth: {
                user: "tab_1337@ukr.net",
                pass: process.env.UKR_NET_PASSWORD,
            },
        });
        const mailOptions = {
            from: "tab_1337@ukr.net",
            to: email,
            subject: "2FA",
            text: message,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    });
}
exports.default = sendOtp;
