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
  name: string;
  email: string;
  img: Types.ObjectId | undefined;
  password: string;
}
