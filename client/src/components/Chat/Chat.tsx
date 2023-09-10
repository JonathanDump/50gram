import cl from "./Chat.module.scss";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Message from "../Message/Message";
import useChat from "../../hooks/useChat";
import userFromJwt from "../../helpers/userFromJwt";
import attachmentsIcon from "/icons/attachments.svg";
import { useOutletContext } from "react-router-dom";
import { IMessageRef } from "../../interfaces/interfaces";
import ImageMessage from "../ImageMessage/ImageMessage";

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const { chat, loading, error, sendMessage } = useChat();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  // let setMessage: React.Dispatch<React.SetStateAction<IMessageRef>> =
  //   useOutletContext();
  const [message, setMessage] = useState<IMessageRef>({ file: null, text: "" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("input change");

    if (e.target.name === "attachments") {
      console.log("attachments");
      setMessage({ file: e.target.files![0], text: inputValue });
      // file = e.target.files![0];
      console.log("file", e.target.files![0]);

      // text = inputValue;
      return;
    }
    setInputValue(e.target.value);
  };

  const handleAttachmentsClick = () => {
    inputFileRef.current!.click();
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    sendMessage({
      text: inputValue,
      myId: userFromJwt()!._id,
      chatId: chat!._id,
    });
    setInputValue("");
  };

  if (error) {
    return <div>Something went wrong</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cl.chat}>
      <div className={cl.messagesWindow}>
        {chat!.messages.map((msg) => {
          return <Message message={msg} key={msg._id} />;
        })}
      </div>
      <form className={cl.messageForm} onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="message"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className={cl.attachments} onClick={handleAttachmentsClick}>
          <img src={attachmentsIcon} alt="" />
          <input
            ref={inputFileRef}
            type="file"
            style={{ display: "none" }}
            name="attachments"
            id="attachments"
            accept="image/png, image/gif, image/jpeg"
            onChange={handleInputChange}
          />
        </div>
        <button>Send</button>
      </form>
      {message.file && (
        <ImageMessage
          file={message.file}
          text={message.text}
          chat={chat}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}
