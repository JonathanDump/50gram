import { totp } from "otplib";
const nodemailer = require("nodemailer");

export default async function sendOtp(email: string): Promise<boolean> {
  const secret = process.env.OTP_SECRET!;
  const optToken = totp.generate(secret);
  console.log("otp", optToken);

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

  return new Promise<boolean>((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: Error, info: any) {
      if (error) {
        console.log(error);
        resolve(false);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}
