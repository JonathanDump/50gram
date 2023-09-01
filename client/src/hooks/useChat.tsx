import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ChatInterface } from "../interfaces/interfaces";

export default function useChat() {
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<ChatInterface | null>(null);
  const { userId } = useParams();
  const location = useLocation();

  useEffect(() => {
    async function getChat() {
      try {
        const URL = import.meta.env.VITE_API_ENDPOINT;
        const token = localStorage.getItem("token") as string;

        console.log("params", userId);

        const response = await fetch(`${URL}/50gram/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Couldn't find the chat");
        }

        const result = await response.json();
        console.log(result);
        setChat(result);
        setLoading(false);
      } catch (err) {
        console.log("err", err);

        setError(err);
      }
    }

    getChat();
  }, [location]);
  console.log("hook obj", { error, loading, chat, setChat });

  return { error, loading, chat, setChat };
}
