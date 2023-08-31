import { Types } from "mongoose";

export interface ImageInterface {
  url?: string | undefined;
  name?: string | undefined;
  image?:
    | {
        data?: Buffer | undefined;
        contentType?: string | undefined;
      }
    | undefined;
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  img: Types.ObjectId | undefined;
  password: string;
}

export interface DecodedJwt {
  iat: number;
  exp: number;
  user: UserInterface;
}
