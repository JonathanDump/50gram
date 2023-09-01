import { MessageParams } from "../../interfaces/interfaces";
import cl from "./Message.module.scss";
import { format } from "date-fns";
import React from "react";

export default function Message({ message }: MessageParams) {
  return (
    <div className={cl.message}>
      <div className={cl.text}>{message.text}</div>
      <div className={cl.date}>{format(new Date(message.date), "HH:mm")}</div>
    </div>
  );
}
