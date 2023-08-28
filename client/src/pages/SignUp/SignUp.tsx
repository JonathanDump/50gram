import cl from "./SignUp.module.scss";
import React, { ChangeEvent, useState } from "react";
import formCl from "..//../scss/form.module.scss";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useNavigate } from "react-router-dom";
import { InputValueInterface } from "../../interfaces/interfaces";

export default function SignUp() {
  const [inputValue, setInputValue] = useState<InputValueInterface>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const navigate = useNavigate();
  console.log(inputValue);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.name === "avatar") {
      setInputValue({ ...inputValue, avatar: e.target.files![0] });
      console.log(e.target.files![0]);
      console.log(inputValue);
    } else {
      setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const URL = import.meta.env.VITE_API_ENDPOINT;
      const formData = new FormData();

      formData.append("name", inputValue.name);
      formData.append("email", inputValue.email);
      formData.append("password", inputValue.password);
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
              onChange={handleInputChange}
            />
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
              value={inputValue.password}
              onChange={handleInputChange}
            />
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
        <GoogleButton title="Sign Up" />
      </div>
    </div>
  );
}
