import cl from "./Chat.module.scss";
import btn from "../../scss/button.module.scss";
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
import attachmentsIcon from "/icons/attachmentsImg.svg";
import { useLocation, useOutletContext } from "react-router-dom";
import { IMessage } from "../../interfaces/interfaces";
import ImageMessage from "../ImageMessage/ImageMessage";

export default function Chat() {
  const [inputValue, setInputValue] = useState({
    prevValue: "",
    currentValue: "",
  });
  console.log("message input value", inputValue);

  const { chat, loading, error, sendMessage, userId, loadMessages } = useChat();
  console.log("chat", chat);

  const [message, setMessage] = useState<IMessage>({ file: null, text: "" });

  const location = useLocation();

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputTextRef = useRef<HTMLInputElement | null>(null);
  const messagesWindowRef = useRef<HTMLDivElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior });
    messagesWindowRef.current?.scrollTo(
      0,
      messagesWindowRef.current?.scrollHeight
    );
  };

  useEffect(() => {
    // scrollToBottom();

    if (inputTextRef.current) {
      inputTextRef.current.textContent = "";
      inputTextRef.current.focus();
    }
  }, [chat]);

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
    setInputValue({
      ...inputValue,
      currentValue: e.target.textContent as string,
    });
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

    setTimeout(() => {
      scrollToBottom();
    }, 200);
    // inputTextRef.current!.textContent = "";
    // inputTextRef.current?.focus();
    // setTimeout(() => {
    //   scrollToBottom();
    // }, 200);
  };

  if (error) {
    return (
      <div className={cl.chat}>
        <div className={cl.componentStatus}>Something went wrong</div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className={cl.chat}>
        <div className={cl.componentStatus}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={cl.chat}>
      <div className={cl.header}>
        <div className={cl.userName}>
          {chat!.getInterlocutor(userId!)?.name}
        </div>
        <div className={cl.onlineStatus}>
          {chat!.getInterlocutorLastOnline(userId!)}
        </div>
      </div>
      <div
        className={cl.container}
        onScroll={() => {
          messagesWindowRef.current?.scroll();
        }}
      >
        <div
          className={cl.messagesWindow}
          ref={messagesWindowRef}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            // console.log(
            //   "scrollHeight",
            //   messagesWindowRef.current?.scrollHeight
            // );
            // console.log("scrollTop", messagesWindowRef.current?.scrollTop);
            // console.log(
            //   "clientHeight",
            //   messagesWindowRef.current!.clientHeight
            // );
            const { scrollHeight, scrollTop, clientHeight } =
              messagesWindowRef.current!;
            const pxToEnd = scrollHeight + scrollTop - clientHeight;
            console.log("pxToEnd", pxToEnd);

            if (pxToEnd < 3) {
              pageRef.current++;
              loadMessages(pageRef.current);
            }
          }}
        >
          {chat!.messages.map((msg) => {
            return <Message message={msg} key={msg._id} />;
          })}
          <div style={{ height: "12px" }}></div>
        </div>
        <form className={cl.messageForm} onSubmit={handleFormSubmit}>
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
          {/* <input
            type="text"
            name="message"
            autoFocus
            value={inputValue.currentValue}
            onChange={handleInputChange}
            ref={inputTextRef}
          /> */}
          <div
            className={cl.inputMessage}
            contentEditable={true}
            autoFocus
            onInput={handleInputChange}
            ref={inputTextRef}
            placeholder={"Message"}
          ></div>
          <button className={btn.sendButton}>
            <img src="/icons/sendButtonLight.svg" alt="" />
          </button>
        </form>
      </div>
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
