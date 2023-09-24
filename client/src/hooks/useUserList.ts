import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SERVER_URL } from "../config/config";
import { UserInterface } from "../interfaces/interfaces";
import userFromJwt from "../helpers/userFromJwt";
import { useParams } from "react-router-dom";

export let socket = io(SERVER_URL, {
  autoConnect: false,
  auth: { token: localStorage.getItem("token") as string },
});

export default function useUserList() {
  const [users, setUsers] = useState<UserInterface[] | []>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const signUpUser = async (user: UserInterface) => {
    socket.emit("signUpUser", user);
  };

  const getAllUsers = () => {
    if (userFromJwt()?._id) {
      socket.emit("getAllUsers", userFromJwt()!._id);
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token") as string;
    socket.auth = { token: jwt };

    socket.connect();

    socket.on("connect", () => {
      getAllUsers();
    });

    socket.on("invalid token", () => {
      const jwt = localStorage.getItem("token") as string;
      if (!jwt) {
        return;
      }
      socket.disconnect();
      socket.auth = { token: jwt };

      setTimeout(() => {
        socket.connect();
      }, 100);
    });

    socket.on("allUsers", (users) => {
      setLoading(false);
      setUsers(users);
    });

    socket.on("updateUserList", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("get notification", (senderId: string) => {
      if (senderId === userId) {
        return;
      }
      setUsers((prevUsers) => {
        if (!prevUsers.length) {
          return [];
        }
        const copyUsers = prevUsers.map((user) => {
          if (user._id === senderId) {
            return { ...user, newMessages: (user.newMessages || 0) + 1 };
          }
          return user;
        });

        return copyUsers;
      });
    });

    socket.on("disconnect user", () => {
      socket.auth = { token: "" };
    });

    return () => {
      socket.off("connect");
      socket.off("signUpUser");
      socket.off("GetAllUsers");
      socket.off("allUsers");
      socket.off("get notification");
      socket.off("updateUserList");
      socket.off("invalid token");
      socket.off("disconnect user");
      socket.disconnect();
    };
  }, []);

  return { loading, users, signUpUser, setUsers };
}
