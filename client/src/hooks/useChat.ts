import { useEffect, useState } from "react";
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ChatInterface,
  ISendMessage,
  MessageInterface,
} from "../interfaces/interfaces";
import { SERVER_URL } from "../config/config";

import { socket } from "../hooks/useUserList";
// const socket = io(SERVER_URL);

export default function useChat() {
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<ChatInterface | null>(null);
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // const getChat = () => {
  //   socket.emit(
  //     "get chat",
  //     { userId, myId: userFromJwt()!._id },
  //     ({ chat }) => {
  //       console.log("received chat", chat);
  //       setLoading(false);
  //       setChat(chat);
  //     }
  //   );
  // };

  const sendMessage = (messageData: ISendMessage) => {
    if (!messageData.text.trim()) {
      return;
    }
    socket.emit("send message", messageData, (message: MessageInterface) => {
      console.log("EMIT");
      setChat((prevChat) => {
        const newChat = { ...prevChat };
        const newMessages = [...prevChat!.messages];

        newMessages.push(message);
        newChat.messages = newMessages;
        return newChat as ChatInterface;
      });
    });
  };

  useEffect(() => {
    async function getChat() {
      try {
        const token = localStorage.getItem("token") as string;

        console.log("params", userId);

        const response = await fetch(`${SERVER_URL}/50gram/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 401) {
          return navigate("/log-in");
        }

        const result = await response.json();
        console.log("useChat fetch res", result);
        setChat(result);
        setLoading(false);
      } catch (err) {
        console.log("err", err);

        setError(err);
      }
    }

    getChat();

    socket.on("receive message", (message: MessageInterface) => {
      console.log("ON");

      setChat((prevChat) => {
        const newChat = { ...prevChat };
        const newMessages = [...prevChat!.messages];

        newMessages.push(message);
        newChat.messages = newMessages;
        return newChat as ChatInterface;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("get chat");
      socket.off("receive message");
    };
  }, [location]);

  return { error, loading, chat, setChat, sendMessage };
}
