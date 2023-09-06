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
}

export interface SidebarInterface {
  users: UserInterface[];
}

export interface UserCardInterface {
  user?: UserInterface;
  editOn?: boolean;
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
}

export interface ChatInterface {
  _id: string;
  users: string[];
  messages: MessageInterface[];
  _v: number;
}

export interface MessageParams {
  message: MessageInterface;
}

export interface ISendMessage {
  text: string;
  myId: string;
  chatId: string;
}
