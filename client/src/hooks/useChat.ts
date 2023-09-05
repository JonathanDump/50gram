import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ChatInterface } from "../interfaces/interfaces";
import { SERVER_URL } from "../config/config";
import { io } from "socket.io-client";
import userFromJwt from "../helpers/userFromJwt";

const socket = io(SERVER_URL);

export default function useChat() {
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<ChatInterface | null>(null);
  const { userId } = useParams();
  const location = useLocation();

  useEffect(() => {
    // async function getChat() {
    //   try {
    //     const token = localStorage.getItem("token") as string;

    //     console.log("params", userId);

    //     const response = await fetch(`${SERVER_URL}/50gram/${userId}`, {
    //       headers: {
    //         Authorization: token,
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error("Couldn't find the chat");
    //     }

    //     const result = await response.json();
    //     console.log("useChat fetch res", result);
    //     setChat(result);
    //     setLoading(false);
    //   } catch (err) {
    //     console.log("err", err);

    //     setError(err);
    //   }
    // }

    // getChat();

    socket.on("connect", () => {
      console.log("connected to chat");
    });
    console.log(userId, userFromJwt()!._id);

    socket.emit("get chat", { userId, myId: userFromJwt()!._id });

    socket.on("receive chat", (chat) => {
      console.log("receive chat", chat);

      setChat(chat);
      setLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("receive chat");
    };
  }, [location]);
  console.log("hook obj", { error, loading, chat, setChat });

  return { error, loading, chat, setChat };
}
