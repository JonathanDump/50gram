import cl from "./LogIn.module.scss";
import formCl from "../../scss/form.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useState } from "react";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { SERVER_URL } from "../../components/config/config";

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

      const body = { email: inputValue.email, password: inputValue.password };
      console.log("body", body);

      const response = await fetch(`${SERVER_URL}/log-in/jwt`, {
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

        <GoogleButton />
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
