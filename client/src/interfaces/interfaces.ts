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
