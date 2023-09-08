import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SERVER_URL } from "../config/config";
import { UserInterface } from "../interfaces/interfaces";
import userFromJwt from "../helpers/userFromJwt";

console.log("token storage", localStorage.getItem("token"));

export let socket = io(SERVER_URL, {
  autoConnect: false,
  auth: { token: localStorage.getItem("token") as string },
});

export default function useUserList() {
  const [users, setUsers] = useState<UserInterface[] | []>([]);
  const [loading, setLoading] = useState(true);

  const signUpUser = async (user: UserInterface) => {
    socket.emit("signUpUser", user);
  };
  console.log("use user List");

  const getAllUsers = () => {
    if (userFromJwt()?._id) {
      socket.emit("getAllUsers", { id: userFromJwt()!._id });
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token") as string;
    socket.auth = { token: jwt };

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to the server");

      getAllUsers();
    });

    socket.on("invalid token", () => {
      console.log("invalid token");

      const jwt = localStorage.getItem("token") as string;
      if (!jwt) {
        return;
      }
      socket.disconnect();
      socket.auth = { token: jwt };

      console.log("reconnect");
      // socket = io(SERVER_URL, {
      //   autoConnect: false,
      //   auth: { token: jwt },
      // });

      setTimeout(() => {
        socket.connect();
      }, 100);
    });

    socket.on("allUsers", (users) => {
      console.log("users", users);
      setLoading(false);
      setUsers(users);
    });

    socket.on("updateUserList", (user) => {
      console.log("Updating user list");
      console.log("new user", user);
      console.log("users in state", users);

      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("disconnect user", () => {
      console.log("disconnect");

      socket.auth = { token: "" };
    });

    return () => {
      socket.off("connect");
      socket.off("allUsers");
      socket.off("updateUserList");
      socket.off("invalid token");
      socket.off("disconnect user");
      socket.disconnect();
    };
  }, []);

  return { loading, users, signUpUser };
}
