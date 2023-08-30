import cl from "./LogIn.module.scss";
import formCl from "../../scss/form.module.scss";
import { DecodedJwt } from "../../interfaces/interfaces";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useState } from "react";

export default function LogIn() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [invalidInput, setInvalidInput] = useState({
    email: false,
    password: false,
  });
  console.log(inputValue);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("inv res", invalidInput);
      const URL = import.meta.env.VITE_API_ENDPOINT;
      const body = { email: inputValue.email, password: inputValue.password };
      console.log("body", body);

      const response = await fetch(`${URL}/log-in/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Can't log in");
      }

      const result = await response.json();
      console.log("res", result);

      if (result.invalid) {
        setInvalidInput(result.invalid);
        return;
      }

      console.log("myInfo log", result.myInfo);

      localStorage.setItem("token", result.token);
      // localStorage.setItem("myInfo", JSON.stringify(result.myInfo));

      setInvalidInput({ email: false, password: false });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={cl.logIn}>
      <div className={cl.formWrapper}>
        <form onSubmit={handleFormSubmit}>
          <div className={formCl.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={inputValue.email}
              onChange={handleInputChange}
            />
            {invalidInput.email && (
              <div className={formCl.inputError}>invalid Email</div>
            )}
          </div>
          <div className={formCl.inputContainer}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={inputValue.password}
              onChange={handleInputChange}
            />
            {invalidInput.password && (
              <div className={formCl.inputError}>invalid Password</div>
            )}
          </div>
          <button>Log In</button>
        </form>
        <div className={cl.text}>Or</div>
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
          Don't have an account?{" "}
          <span>
            <NavLink to="/sign-up" className={formCl.NavLink}>
              Sign Up
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}
