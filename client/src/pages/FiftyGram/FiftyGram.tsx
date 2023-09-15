import { redirect, useNavigate, useOutlet } from "react-router-dom";
import cl from "./FiftyGram.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SERVER_URL } from "../../config/config";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import ImageMessage from "../../components/ImageMessage/ImageMessage";
import { useRef, useState } from "react";
import { IMessage } from "../../interfaces/interfaces";

export default function FiftyGram() {
  // const [message, setMessage] = useState<IMessage>({ file: null, text: "" });
  // console.log("messageRef fifty gram", message);

  const outlet = useOutlet();
  return (
    <AuthProvider>
      <div className={cl.fiftyGram}>
        <div className={cl.window}>
          <Sidebar />
          {outlet || <div>Choose chat to start messaging</div>}
        </div>
        {/* {message.file && (
          <ImageMessage
            file={message.file}
            text={message.text}
            setMessage={setMessage}
          />
        )} */}
      </div>
    </AuthProvider>
  );
}
