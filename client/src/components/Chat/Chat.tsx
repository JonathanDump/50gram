import cl from "./Chat.module.scss";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Message from "../Message/Message";
import useChat from "../../hooks/useChat";
import userFromJwt from "../../helpers/userFromJwt";

import { NavLink, useLocation, useOutletContext } from "react-router-dom";
import { IMessage, IOutletContext } from "../../interfaces/interfaces";
import ImageMessage from "../ImageMessage/ImageMessage";

import isOnline from "../../helpers/isOnline";
import { ReactComponent as BackArrowIcon } from "/public/icons/backArrow.svg";
import InputMessage from "../InputMessage/InputMessage";

export default function Chat() {
  const [inputValue, setInputValue] = useState({
    prevValue: "",
    currentValue: "",
  });
  console.log("message input value", inputValue);

  const { chat, loading, error, sendMessage, userId, loadMessages } = useChat();
  const { usersOnline, isWindowNarrow }: IOutletContext = useOutletContext();

  console.log("chat", chat);

  const [message, setMessage] = useState<IMessage>({ file: null, text: "" });

  const location = useLocation();

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputTextRef = useRef<HTMLInputElement | null>(null);
  const messagesWindowRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);
  const thresholdRef = useRef(50);

  const scrollToBottom = () => {
    messagesWindowRef.current?.scrollTo(
      0,
      messagesWindowRef.current?.scrollHeight
    );
  };

  useEffect(() => {
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
      userId: userId!,
    });
    setInputValue({
      prevValue: "",
      currentValue: "",
    });

    setTimeout(() => {
      scrollToBottom();
    }, 200);
  };

  const handleChatScroll = async () => {
    const { scrollHeight, scrollTop, clientHeight } =
      messagesWindowRef.current!;
    const pxToEnd = scrollHeight + scrollTop - clientHeight;
    console.log(pxToEnd);

    if (pxToEnd <= thresholdRef.current) {
      thresholdRef.current = -1;

      pageRef.current++;
      loadMessages(pageRef.current);
      await setTimeout(() => (thresholdRef.current = 50), 1000);
      console.log("threshold upd", thresholdRef.current);
    }
    console.log("threshold", thresholdRef.current);
  };

  const inputMessageProps = {
    handleFormSubmit,
    handleAttachmentsClick,
    handleInputChange,
    inputFileRef,
    inputTextRef,
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
        {isWindowNarrow && (
          <NavLink to={"/"}>
            <div className={cl.iconArrow}>
              <BackArrowIcon />
            </div>
          </NavLink>
        )}
        <div className={cl.meta}>
          <div className={cl.userName}>
            {chat!.getInterlocutor(userId!)?.name}
          </div>
          <div className={cl.onlineStatus}>
            {isOnline(usersOnline, userId!)
              ? "online"
              : chat!.getInterlocutorLastOnline(userId!)}
          </div>
        </div>
      </div>
      <div className={cl.wrapper}>
        <div
          className={cl.container}
          ref={messagesWindowRef}
          onScroll={handleChatScroll}
        >
          <div className={cl.messagesWindow}>
            {chat!.messages.map((msg) => {
              return <Message message={msg} key={msg._id} />;
            })}
            <div style={{ height: "12px" }}></div>
          </div>
        </div>
        <InputMessage {...inputMessageProps} />
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
