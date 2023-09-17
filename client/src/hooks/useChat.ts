import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChatInterface,
  ISendMessage,
  MessageInterface,
  UserInterface,
} from "../interfaces/interfaces";
import { SERVER_URL } from "../config/config";

import { socket } from "../hooks/useUserList";
import { format, isToday, isYesterday } from "date-fns";
import pushLoadedMessages from "../helpers/pushLoadedMessages";

import userFromJwt from "../helpers/userFromJwt";
import unshiftNewMessage from "../helpers/unshiftNewMessage";
// const socket = io(SERVER_URL);

export class Chat implements ChatInterface {
  constructor(
    public _id: string,
    public users: UserInterface[],
    public messages: MessageInterface[],
    public _v: number
  ) {}

  static fromObject(obj: ChatInterface): Chat {
    return new Chat(obj._id, obj.users, obj.messages, obj._v);
  }

  getReversedMessages(): MessageInterface[] {
    return [...this.messages].reverse();
  }

  getInterlocutor(userId: string) {
    return this.users.find((user) => user._id === userId);
  }

  getInterlocutorLastOnline(userId: string) {
    const lastOnline = this.getInterlocutor(userId)?.lastOnline!;

    const timeAgo = Date.now() - lastOnline;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = week * 4;
    if (timeAgo < hour) {
      const minutes = Math.ceil(timeAgo / minute);
      return `last seen ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (isYesterday(lastOnline)) {
      return `last seen yesterday at ${format(new Date(lastOnline), "HH:mm")}`;
    } else if (timeAgo < day) {
      const hours = Math.ceil(timeAgo / hour);
      return `last seen ${hours === 1 ? "hour" : "hour"} ago`;
    } else if (day < timeAgo && timeAgo < day * 2) {
      return "last seen 2 days ago";
    } else if (day * 2 < timeAgo && timeAgo < week) {
      return "last seen within a week";
    } else if (timeAgo < month) {
      return "last seen within a month";
    } else {
      return "last seen a long tome ago";
    }
  }
}

export default function useChat() {
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<Chat | null>(null);
  const { userId } = useParams();
  const myUserObject = userFromJwt();
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
    socket.emit("send message", messageData, (message: MessageInterface) => {
      console.log("EMIT");
      console.log("send message emit result", message);

      setChat((prevChat) => {
        if (!prevChat) {
          return null;
        }
        // const newChat = { ...prevChat };
        // const newMessages = [...prevChat!.messages];

        // newMessages.push(message);
        // newChat.messages = newMessages;
        // console.log("set new chat", newChat);

        // return Chat.fromObject(newChat);

        return Chat.fromObject(unshiftNewMessage(prevChat, message));
      });
    });
  };

  const loadMessages = (page: number) => {
    console.log("loading new messages");

    socket.emit(
      "load messages",
      { page, myId: myUserObject!._id, userId },
      (messages: MessageInterface[]) => {
        setChat((prevChat) => {
          if (!prevChat) {
            return null;
          }
          console.log("loaded messages", messages);

          return Chat.fromObject(pushLoadedMessages(prevChat, messages));
        });
      }
    );
  };

  useEffect(() => {
    async function getChat(page: number = 1) {
      try {
        console.log("getting chat");

        const token = localStorage.getItem("token") as string;

        console.log("params", userId);

        const response = await fetch(`${SERVER_URL}/50gram/${userId}`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page }),
        });

        if (response.status === 401) {
          const response = await fetch(`${SERVER_URL}/get-new-jwt`, {
            headers: {
              Authorization: token,
            },
          });
          const result = await response.json();
          console.log("new token", result.token);

          localStorage.setItem("token", result.token as string);
          return getChat();
          // return navigate("/log-in");
        }

        const result = await response.json();
        console.log("useChat fetch res", result);

        socket.emit("join chat", result._id);

        setChat(Chat.fromObject(result));
        // setChat(result);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.log("err", err);

        setError(err);
      }
    }

    getChat();

    socket.on("receive message", (message: MessageInterface) => {
      console.log("receive message");

      setChat((prevChat) => {
        if (!prevChat) {
          return null;
        }
        // const newChat = { ...prevChat };
        // const newMessages = [...prevChat!.messages];

        // newMessages.push(message);
        // newChat.messages = newMessages;
        // return Chat.fromObject(newChat);

        return Chat.fromObject(unshiftNewMessage(prevChat, message));
        // return newChat as ChatInterface;
      });
    });

    socket.on("disconnected user", (userDisconnected: UserInterface) => {
      // if (chat!.users.find(user => user._id === userDisconnected._id)) {
      // }
      console.log("userDisconnected", userDisconnected);

      if (chat!.users.find((user) => user._id === userDisconnected._id)) {
        console.log("includes");

        setChat((prevChat) => {
          if (!prevChat) {
            return null;
          }
          const newChat = { ...prevChat };
          const user = prevChat!.users.find(
            (user) => user._id === userDisconnected._id
          );
          user!.lastOnline = userDisconnected.lastOnline;
          return Chat.fromObject(newChat);
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("get chat");
      socket.off("receive message");
      socket.off("load messages");
      socket.off("disconnected user");
    };
  }, [location]);

  return { error, loading, chat, setChat, sendMessage, userId, loadMessages };
}
