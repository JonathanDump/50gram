import { Outlet, redirect, useLoaderData, useOutlet } from "react-router-dom";
import cl from "./FiftyGram.module.scss";

import { UserInterface } from "../../interfaces/interfaces";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SERVER_URL } from "../../components/config/config";

export const loader = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/log-in");
  }

  const response = await fetch(`${SERVER_URL}/50gram`, {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  const { users } = await response.json();
  console.log(users);

  return users;
};

export default function FiftyGram() {
  // const users = useLoaderData() as UserInterface[];
  const outlet = useOutlet();
  const token = localStorage.getItem("token");

  if (!token) {
    redirect("/log-in");
    return;
  }
  return (
    <div className={cl.fiftyGram}>
      <div className={cl.window}>
        <Sidebar />
        <div className={cl.chatContainer}>
          {outlet || <div>Choose chat to start messaging</div>}
        </div>
      </div>
    </div>
  );
}
