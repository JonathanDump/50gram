import React, { ChangeEvent } from "react";
export interface GoogleButtonProps {
  title: "Log in" | "Sign Up";
}

export interface InputValueInterface {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: Blob | null;
}

export interface DecodedJwt {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  locale: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

export interface UserInterface {
  _id: string;
  name: string;
  email?: string;
  img: string;
  password?: string;
  lastOnline?: number;
}

export interface SidebarInterface {
  users: UserInterface[];
}

export interface UserCardInterface {
  user?: UserInterface;
  editOn?: boolean;
  isOnline?: boolean;
  menuVisible?: boolean;
  isSelected?: boolean;
}

export interface DecodedJwt {
  iat: number;
  exp: number;
  user: UserInterface;
}

export interface MessageInterface {
  _id: string;
  text: string;
  date: string;
  imageUrl?: string;
  user: string;
}

export interface ChatInterface {
  _id: string;
  users: UserInterface[];
  messages: MessageInterface[];
  _v: number;
}

export interface MessageParams {
  message: MessageInterface;
}

export interface ISendMessage {
  text: string;
  imageUrl?: string;
  myId: string;
  chatId: string;
}

export interface IAuthProviderParams {
  children: React.ReactNode;
}

export interface IUserIds {
  userId: string;
  socketId: string;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface IMessage {
  file: Blob | null;
  text: string;
}

export interface ImageMessageProps extends IMessage {
  setMessage: React.Dispatch<React.SetStateAction<IMessage>>;
  chat: ChatInterface | null;
  sendMessage: (messageData: ISendMessage) => void;
  setInputValueChat: React.Dispatch<
    React.SetStateAction<{
      prevValue: string;
      currentValue: string;
    }>
  >;
  inputValueChat: {
    prevValue: string;
    currentValue: string;
  };
}

export interface avatarInputFileProps {
  editOn?: boolean;
  imgRef: React.MutableRefObject<HTMLImageElement | null>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setButtonsOn?: React.Dispatch<React.SetStateAction<boolean>>;
  decodedJwt?: DecodedJwt;
}
