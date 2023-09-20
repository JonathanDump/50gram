import jwt, { Secret, SignOptions } from "jsonwebtoken";
import envReader from "./envReader";

export default async function generateJwt(
  user: any,
  expiresIn: string = "100d"
) {
  

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
  

  return token;
}
