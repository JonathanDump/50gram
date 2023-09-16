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
  _id?: string;
  name?: string;
  email?: string;
  messages?: Types.ObjectId[];
  chats?: Types.ObjectId[];
  img?: string | undefined;
  googleId?: string | undefined;
  password?: string | undefined;
}

export interface DecodedJwt {
  iat: number;
  exp: number;
  user: UserInterface;
}

export interface ISendMessage {
  text: string;
  imageUrl: string;
  myId: string;
  chatId: string;
}

export interface ILoadMessages {
  page: number;
  myId: string;
  userId: string;
}
