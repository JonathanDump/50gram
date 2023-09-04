import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SERVER_URL } from "../components/config/config";
import jwtDecode from "jwt-decode";
import { DecodedJwt, UserInterface } from "../interfaces/interfaces";
import userFromJwt from "../helpers/userFromJwt";

var socket = io(SERVER_URL);

console.log("324234234234234");

export default function useUserList() {
  const [users, setUsers] = useState<UserInterface[] | []>([]);
  const [loading, setLoading] = useState(true);

  // const token = localStorage.getItem("token") as string;

  // const decodedJwt = jwtDecode(token) as DecodedJwt;

  const signUpUser = async (user: UserInterface) => {
    socket.emit("signUpUser", user);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.emit("getAllUsers", { id: userFromJwt()?._id });

    socket.on("allUsers", (users) => {
      console.log("users", users);

      setUsers(users);
      setLoading(false);
    });

    socket.on("updateUserList", (user) => {
      console.log("Updating user list");
      console.log("new user", user);

      setUsers([...users, user]);
    });
  }, []);

  return { loading, users, signUpUser };
}
