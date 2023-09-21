///<reference types="vite-plugin-svgr/client" />;

import { useParams } from "react-router-dom";
import { MessageParams } from "../../interfaces/interfaces";
import cl from "./Message.module.scss";
import { format } from "date-fns";
import { ReactComponent as ReadIcon } from "/src/icons/read.svg";
import { ReactComponent as UnreadIcon } from "/src/icons/unread.svg";

export default function Message({ message }: MessageParams) {
  const { userId } = useParams();
  const messageClass =
    userId === message.user
      ? `${cl.message} ${cl.messageIn}`
      : `${cl.message} ${cl.messageOut}`;
  return (
    <div className={messageClass}>
      {message.imageUrl && (
        <div className={cl.imgContainer}>
          <img src={message.imageUrl} alt="" />
        </div>
      )}
      <div className={cl.text}>
        {message.text}
        <span className={cl.messageMeta}>
          <span className={cl.date}>
            {format(new Date(message.date), "HH:mm")}
          </span>
          {userId !== message.user && (
            <span className={cl.status}>
              {message.isRead ? <ReadIcon /> : <UnreadIcon />}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
