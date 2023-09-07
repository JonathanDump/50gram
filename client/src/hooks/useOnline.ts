import { useEffect, useRef, useState } from "react";
import { socket } from "./useUserList";
import { IUserIds } from "../interfaces/interfaces";

export default function useOnline() {
  const [usersOnline, setUsersOnline] = useState<IUserIds[]>([]);
  console.log("usersOnline", usersOnline);

  useEffect(() => {
    socket.on("online", (usersConnected) => {
      console.log("users online", usersConnected);

      setUsersOnline(usersConnected);
    });

    socket.on("disconnected", (usersConnected) => {
      console.log("disconnect", usersConnected);
      setUsersOnline(usersConnected);
    });

    return () => {
      socket.off("online");
      socket.off("disconnected");
    };
  }, []);

  return { usersOnline };
}
