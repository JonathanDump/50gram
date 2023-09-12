import cl from "./LogIn.module.scss";
import formCl from "../../scss/form.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import React, { ChangeEvent, FormEvent, useState } from "react";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { SERVER_URL } from "../../config/config";
import OtpInput from "react-otp-input";

export default function LogIn() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [invalidInput, setInvalidInput] = useState({
    email: false,
    password: false,
  });
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);

  console.log(inputValue);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const sendOtpToken = async () => {
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
        return false;
      }
      setInvalidInput({ email: false, password: false });
      return true;
    } catch (err) {
      console.log(err);
    }
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (await sendOtpToken()) && setIsOtp(true);
    // try {
    //   console.log("inv res", invalidInput);

    //   const body = { email: inputValue.email, password: inputValue.password };
    //   console.log("body", body);

    //   const response = await fetch(`${SERVER_URL}/log-in/jwt`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Can't log in");
    //   }

    //   const result = await response.json();
    //   console.log("res", result);

    //   if (result.invalid) {
    //     setInvalidInput(result.invalid);
    //     return;
    //   }

    // console.log("myInfo log", result.myInfo);

    // localStorage.setItem("token", result.token);

    // setInvalidInput({ email: false, password: false });
    // navigate("/");
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleSendNewOtp = async () => {
    (await sendOtpToken()) && setInvalidOtp(false);
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { email: inputValue.email, otp };
      const response = await fetch(`${SERVER_URL}/log-in/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setInvalidOtp(true);
        return;
      }
      const result = await response.json();
      console.log("res", result);

      localStorage.setItem("token", result.token);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (isOtp) {
    return (
      <div className={cl.logIn}>
        <form className={formCl.form} onSubmit={handleOtpSubmit}>
          <div className={cl.message}>
            {invalidOtp ? (
              <div>
                Invalid code. Please try again or
                <button type="button" onClick={handleSendNewOtp}>
                  Send new code
                </button>
              </div>
            ) : (
              "Please enter the code sent to your email"
            )}
          </div>
          <OtpInput
            numInputs={6}
            onChange={setOtp}
            value={otp}
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus={true}
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${cl.logIn} ${formCl.mainContainer}`}>
      <div className={formCl.formWrapper}>
        <form onSubmit={handleFormSubmit} className={formCl.form}>
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
          <button className={formCl.button}>Log In</button>
        </form>
        <div className={cl.text}>Or</div>

        <GoogleButton />
      </div>
      <div className={formCl.additional}>
        <span className={formCl.text}>Don't have an account? </span>
        <span>
          <NavLink to="/sign-up" className={formCl.NavLink}>
            Sign Up
          </NavLink>
        </span>
      </div>
    </div>
  );
}
