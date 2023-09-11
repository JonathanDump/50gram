import { Secret, SignOptions } from "jsonwebtoken";
import { UserInterface } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

require("dotenv").config();

export function envReader(variable: string): string {
  const result = process.env[variable];
  if (!result) {
    throw new Error("Can't find the env variable");
  }
  return result;
}

export async function generateJwt(user: any, expiresIn: string = "100d") {
  console.log("generating jwt from user", { ...user });

  const opts: SignOptions = {};
  opts.expiresIn = expiresIn;
  const secret: Secret = envReader("SECRET_KEY");
  const token = await jwt.sign(
    {
      user: {
        name: user!.name,
        email: user!.email,
        img: user!.img,
        _id: user!._id,
      },
    },
    secret,
    opts
  );
  console.log("generated token", token);

  return token;
}
