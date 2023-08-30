import { Outlet, redirect, useLoaderData } from "react-router-dom";
import cl from "./FiftyGram.module.scss";
import React from "react";
import { usersDataLoader } from "../../interfaces/interfaces";
import Sidebar from "../../components/Sidebar/Sidebar";

export const loader = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/log-in");
  }

  const URL = import.meta.env.VITE_API_ENDPOINT;
  const response = await fetch(`${URL}/50gram`, {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  const { users } = await response.json();
  console.log(users);

  return { users } as usersDataLoader;
};
export default function FiftyGram() {
  const users = useLoaderData();

  return (
    <div className={cl.fiftyGram}>
      <div className={cl.window}>
        <Sidebar />
        <div className={cl.chatContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
