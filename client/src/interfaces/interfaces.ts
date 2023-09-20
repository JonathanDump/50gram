import React, { ChangeEvent, FormEvent } from "react";
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
  chat?: ChatInterface;
  newMessages?: number;
  isVerified?: boolean;
}

export interface SidebarInterface {
  users: UserInterface[];
}

export interface UserCardParams {
  user: UserInterface;
  isOnline: boolean;
  isSelected: boolean;
  setUsers: React.Dispatch<React.SetStateAction<UserInterface[] | []>>;
  users: UserInterface[];
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
  isRead: boolean;
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
  userId: string;
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

export interface SidebarParams {
  usersOnline: IUserIds[];
  isWindowNarrow: boolean;
}

export interface IOutletContext {
  usersOnline: IUserIds[];
  isWindowNarrow: boolean;
}

export interface InputMessageProps {
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleAttachmentsClick: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputFileRef: React.MutableRefObject<HTMLInputElement | null>;
  inputTextRef: React.MutableRefObject<HTMLInputElement | null>;
}

export interface MenuProps {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
