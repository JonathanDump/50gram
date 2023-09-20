import { Types } from "mongoose";

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  messages?: Types.ObjectId[];
  chats?: Types.ObjectId[];
  img?: string | undefined;
  googleId?: string | undefined;
  password?: string | undefined;
  lastOnline?: number;
  isVerified?: boolean;
}

export interface DecodedJwt {
  iat: number;
  exp: number;
  user: UserInterface;
}

export interface ISendMessage {
  text?: string;
  imageUrl?: string;
  myId: string;
  chatId: string;
  userId: string;
}

export interface ILoadMessages {
  page: number;
  myId: string;
  userId: string;
}

export interface IReadMessage {
  messageId: string;
  chatId: string;
}
