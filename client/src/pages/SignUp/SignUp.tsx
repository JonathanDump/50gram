import cl from "./SignUp.module.scss";
import React, { ChangeEvent, useState } from "react";
import formCl from "..//../scss/form.module.scss";
import { useNavigate, NavLink } from "react-router-dom";
import { DecodedJwt, InputValueInterface } from "../../interfaces/interfaces";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

export default function SignUp() {
  const [inputValue, setInputValue] = useState<InputValueInterface>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [validPassword, setValidPassword] = useState({
    length: false,
    number: false,
  });
  const [invalidName, setInvalidName] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.name === "avatar") {
      setInputValue({ ...inputValue, avatar: e.target.files![0] });
    } else {
      setInputValue({ ...inputValue, [e.target.name]: e.target.value });

      if (e.target.name === "password") {
        const updatedValidPassword = { ...validPassword };

        updatedValidPassword.length = e.target.value.length >= 5;

        updatedValidPassword.number = /\d/.test(e.target.value);

        setValidPassword(updatedValidPassword);
      }
      if (e.target.name === "name") {
        setInvalidName(!e.target.name.length);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.name.trim().length) {
      setInputValue({ ...inputValue, name: "" });
      setInvalidName(true);
      return;
    } else if (inputValue.password !== inputValue.confirmPassword) {
      setPasswordNotMatch(true);
      return;
    }

    try {
      const URL = import.meta.env.VITE_API_ENDPOINT;
      const formData = new FormData();

      formData.append("name", inputValue.name);
      formData.append("email", inputValue.email);
      formData.append("password", inputValue.password);
      console.log("formData", formData);

      inputValue.avatar && formData.append("avatar", inputValue.avatar);

      const response = await fetch(`${URL}/sign-up`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Can't Sigh Up");
      }

      const result = await response.json();

      if (result.isSuccess) {
        navigate("/log-in");
      } else {
        throw new Error("Can't Sigh Up");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={cl.signUp}>
      <div className={cl.formWrapper}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={formCl.inputContainer}>
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              className={formCl.name}
              name="name"
              required
              value={inputValue.name}
              minLength={1}
              onChange={handleInputChange}
            />
            {invalidName && (
              <div className={formCl.inputError}>
                <div className={formCl.invalid}>
                  Name should be at least 1 character long
                </div>
              </div>
            )}
          </div>
          <div className={formCl.inputContainer}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              className={formCl.email}
              name="email"
              required
              value={inputValue.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={formCl.inputContainer}>
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              className={formCl.password}
              name="password"
              required
              minLength={5}
              value={inputValue.password}
              onChange={handleInputChange}
            />
            <div className={formCl.inputError}>
              <div
                className={validPassword.length ? formCl.valid : formCl.invalid}
              >
                At least 5 characters long
              </div>
              <div
                className={validPassword.number ? formCl.valid : formCl.invalid}
              >
                Should contain at least 1 number
              </div>
            </div>
          </div>
          <div className={formCl.inputContainer}>
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              className={formCl.confirmPassword}
              name="confirmPassword"
              required
              value={inputValue.confirmPassword}
              onChange={handleInputChange}
            />
            {passwordNotMatch && (
              <div className={formCl.inputError}>
                <div className={formCl.invalid}>Password doesn't match</div>
              </div>
            )}
          </div>
          <div className={formCl.inputContainer}>
            <label htmlFor={formCl.avatar}></label>
            <input
              type="file"
              className={formCl.avatar}
              name="avatar"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleInputChange}
            />
          </div>
          <button>Sign Up</button>
        </form>
        <div className={cl.text}> Or </div>
        <GoogleOAuthProvider clientId="785080223845-4r2ughnfu2lbdgfns0i0g2gpkqoicjnn.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const URL = import.meta.env.VITE_API_ENDPOINT;
              const decoded: DecodedJwt = jwtDecode(
                credentialResponse.credential!
              );
              const { name, email, picture } = decoded;
              const body = {
                name,
                email,
                img: picture,
              };
              const response = await fetch(`${URL}/sign-up/google`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              });
              const result = await response.json();

              localStorage.setItem("token", result.token);
              // localStorage.setItem("myInfo", result.myInfo);

              result.isSuccess ? navigate("/") : new Error("Sign up failed");
              console.log(decoded);

              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </GoogleOAuthProvider>
      </div>
      <div className={formCl.additional}>
        <div className={formCl.text}>
          Already have an account?
          <span>
            <NavLink to="/log-in" className={formCl.NavLink}>
              Log In
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}
