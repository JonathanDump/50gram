import { useEffect, useState } from "react";
import { socket } from "./useUserList";
import { IUserIds } from "../interfaces/interfaces";

export default function useOnline() {
  const [usersOnline, setUsersOnline] = useState<IUserIds[]>([]);
  

  useEffect(() => {
    socket.on("online", (usersConnected) => {
      

      setUsersOnline(usersConnected);
    });

    socket.on("disconnected", (usersConnected) => {
      
      setUsersOnline(usersConnected);
    });

    return () => {
      socket.off("online");
      socket.off("disconnected");
    };
  }, []);

  return { usersOnline };
}
