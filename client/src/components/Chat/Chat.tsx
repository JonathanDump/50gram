import jwtDecode from "jwt-decode";
import cl from "./Chat.module.scss";
import React, { useState } from "react";
import { DecodedJwt } from "../../interfaces/interfaces";
import { useParams } from "react-router-dom";

export const loader = async ({ params }) => {
  const URL = import.meta.env.VITE_API_ENDPOINT;
  const token = localStorage.getItem("token") as string;

  console.log("params", params.userId);

  const response = await fetch(`${URL}/50gram/${params.userId}`, {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("Couldn't find the chat");
  }

  const result = await response.json();
  console.log(result);

  return result;
};

export default function Chat() {
  return (
    <div className={cl.chat}>
      <div className={cl.messagesWindow}></div>
      <form className={cl.messageForm}>
        <input type="text" name="message" />
        <button>Send</button>
      </form>
    </div>
  );
}
