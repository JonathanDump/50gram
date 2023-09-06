import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SERVER_URL } from "../config/config";
import jwtDecode from "jwt-decode";
import { DecodedJwt, UserInterface } from "../interfaces/interfaces";
import userFromJwt from "../helpers/userFromJwt";

export const socket = io(SERVER_URL, { autoConnect: false });

export default function useUserList() {
  const [users, setUsers] = useState<UserInterface[] | []>([]);
  const [loading, setLoading] = useState(true);

  // const token = localStorage.getItem("token") as string;

  // const decodedJwt = jwtDecode(token) as DecodedJwt;

  const signUpUser = async (user: UserInterface) => {
    socket.emit("signUpUser", user);
  };

  const getAllUsers = () => {
    console.log("id", userFromJwt()!._id);

    socket.emit("getAllUsers", { id: userFromJwt()!._id });
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to the server");
      getAllUsers();
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

    return () => {
      socket.off("connect");
      socket.off("allUsers");
      socket.off("updateUserList");
      socket.disconnect();
    };
  }, []);

  return { loading, users, signUpUser };
}
