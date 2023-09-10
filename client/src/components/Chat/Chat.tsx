import cl from "./Chat.module.scss";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Message from "../Message/Message";
import useChat from "../../hooks/useChat";
import userFromJwt from "../../helpers/userFromJwt";
import attachmentsIcon from "/icons/attachments.svg";
import { useLocation, useOutletContext } from "react-router-dom";
import { IMessage } from "../../interfaces/interfaces";
import ImageMessage from "../ImageMessage/ImageMessage";

export default function Chat() {
  const [inputValue, setInputValue] = useState({
    prevValue: "",
    currentValue: "",
  });
  const { chat, loading, error, sendMessage } = useChat();
  const [message, setMessage] = useState<IMessage>({ file: null, text: "" });

  const location = useLocation();

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputTextRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputTextRef.current?.focus();
  }, [location]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("input change");

    if (e.target.name === "attachments") {
      console.log("attachments input file", e.target.files![0]);
      setMessage({ file: e.target.files![0], text: inputValue.currentValue });

      const newInputValue = {
        prevValue: inputValue.currentValue,
        currentValue: "",
      };
      setInputValue(newInputValue);
      return;
    }
    setInputValue({ ...inputValue, currentValue: e.target.value });
  };

  const handleAttachmentsClick = () => {
    inputFileRef.current!.value = "";
    inputFileRef.current!.click();
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.currentValue.trim()) {
      return;
    }
    sendMessage({
      text: inputValue.currentValue,
      myId: userFromJwt()!._id,
      chatId: chat!._id,
    });
    setInputValue({
      prevValue: "",
      currentValue: "",
    });
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
          autoFocus
          value={inputValue.currentValue}
          onChange={handleInputChange}
          ref={inputTextRef}
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
          setInputValueChat={setInputValue}
          inputValueChat={inputValue}
        />
      )}
    </div>
  );
}
