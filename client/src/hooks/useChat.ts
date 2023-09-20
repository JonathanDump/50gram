import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  ChatInterface,
  ISendMessage,
  MessageInterface,
  UserInterface,
} from "../interfaces/interfaces";
import { SERVER_URL } from "../config/config";

import { socket } from "../hooks/useUserList";
import { format, isYesterday } from "date-fns";
import pushLoadedMessages from "../helpers/pushLoadedMessages";

import userFromJwt from "../helpers/userFromJwt";
import unshiftNewMessage from "../helpers/unshiftNewMessage";
import readMessages from "../helpers/readMessages";

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
      return "last seen a long time ago";
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
  

  useEffect(() => {
    
  }, [chat]);

  const sendMessage = (messageData: ISendMessage) => {
    

    socket.emit("send message", messageData, (message: MessageInterface) => {
      
      

      setChat((prevChat) => {
        if (!prevChat) {
          return null;
        }

        return Chat.fromObject(unshiftNewMessage(prevChat, message));
      });
    });
  };

  const loadMessages = (page: number) => {
    

    socket.emit(
      "load messages",
      { page, myId: myUserObject!._id, userId },
      (messages: MessageInterface[]) => {
        setChat((prevChat) => {
          if (!prevChat) {
            return null;
          }
          

          return Chat.fromObject(pushLoadedMessages(prevChat, messages));
        });
      }
    );
  };

  useEffect(() => {
    

    setLoading(true);

    async function getChat(page: number = 1) {
      try {
        

        const token = localStorage.getItem("token") as string;

        

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
          

          localStorage.setItem("token", result.token as string);
          return getChat();
        }

        const result = await response.json();
        

        setChat(Chat.fromObject(result));

        setLoading(false);
        setError(null);
        socket.emit("join chat", result._id, userId);
      } catch (err) {
        

        setError(err);
      }
    }

    getChat();

    socket.on("join chat", () => {
      

      setChat((prevChat) => {
        if (!prevChat) {
          return null;
        }
        return Chat.fromObject(readMessages(prevChat));
      });
    });

    socket.on("receive message", (message: MessageInterface) => {
      
      if (message.user !== userId) {
        return;
      }
      

      setChat((prevChat) => {
        

        
        if (!prevChat) {
          
          return null;
        }
        
        message.isRead = true;
        const newChat = Chat.fromObject(unshiftNewMessage(prevChat, message));

        
        
        

        socket.emit("read message", {
          messageId: message._id,
          chatId: newChat!._id,
        });

        return newChat;
      });
    });

    socket.on("read message", () => {
      setChat((prevChat) => {
        if (!prevChat) {
          return null;
        }

        return Chat.fromObject(readMessages(prevChat));
      });
    });

    socket.on("disconnected user", (userDisconnected: UserInterface) => {
      

      if (chat!.users.find((user) => user._id === userDisconnected._id)) {
        

        setChat((prevChat) => {
          if (!prevChat) {
            return null;
          }
          const newChat = { ...prevChat };
          const user = newChat!.users.find(
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
      socket.off("join chat");
      socket.off("send message");
      socket.off("receive message");
      socket.off("load messages");
      socket.off("read message");
      socket.off("disconnected user");
    };
  }, [location]);

  return { error, loading, chat, setChat, sendMessage, userId, loadMessages };
}
