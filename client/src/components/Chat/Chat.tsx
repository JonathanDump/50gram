import jwtDecode from "jwt-decode";
import cl from "./Chat.module.scss";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ChatInterface, DecodedJwt } from "../../interfaces/interfaces";
import { useLoaderData, useParams } from "react-router-dom";
import Message from "../Message/Message";
import useChat from "../../hooks/useChat";
import { SERVER_URL } from "../../config/config";
import userFromJwt from "../../helpers/userFromJwt";

// export const loader = async ({ params }: { params: { userId: string } }) => {
//   const URL = import.meta.env.VITE_API_ENDPOINT;
//   const token = localStorage.getItem("token") as string;

//   console.log("params", params.userId);

//   const response = await fetch(`${URL}/50gram/${params.userId}`, {
//     headers: {
//       Authorization: token,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Couldn't find the chat");
//   }

//   const result = await response.json();
//   console.log(result);

//   return result;
// };

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const { chat, loading, error, sendMessage } = useChat();
  const { userId } = useParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log("chat", chat);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({
      text: inputValue,
      myId: userFromJwt()!._id,
      chatId: chat!._id,
    });
    setInputValue("");
    // try {
    //   const token = localStorage.getItem("token") as string;
    //   const decodedJwt = jwtDecode(
    //     localStorage.getItem("token") as string
    //   ) as DecodedJwt;

    //   const formData = new FormData();
    //   formData.append("text", inputValue);
    //   formData.append("myId", decodedJwt.user._id);
    //   formData.append("chatId", chat!._id);

    //   const response = await fetch(
    //     `${SERVER_URL}/50gram/${userId}/sendMessage`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: token,
    //       },
    //       body: formData,
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Couldn't send the message");
    //   }

    //   const result = await response.json();
    //   console.log("result", result);

    //   const newChat = { ...chat } as ChatInterface;
    //   newChat.messages.push(result.message);
    //   setChat(newChat);
    //   setInputValue("");
    // } catch (err) {
    //   console.log(err);
    // }
  };

  if (error) {
    return <div>Something went wrong</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cl.chat}>
      <div className={cl.messagesWindow}>
        {chat!.messages.map((msg) => {
          return <Message message={msg} key={msg._id} />;
        })}
      </div>
      <form className={cl.messageForm} onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="message"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button>Send</button>
      </form>
    </div>
  );
}
