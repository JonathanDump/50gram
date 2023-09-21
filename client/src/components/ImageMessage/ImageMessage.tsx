import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import userFromJwt from "../../helpers/userFromJwt";
import { ImageMessageProps } from "../../interfaces/interfaces";
import cl from "./ImageMessage.module.scss";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export default function ImageMessage({
  file,
  text,
  chat,
  setMessage,
  sendMessage,
  setInputValueChat,
  inputValueChat,
}: ImageMessageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [inputValue, setInputValue] = useState(text);
  // const { sendMessage } = useChat();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const { userId } = useParams();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imgRef.current!.src = reader.result as string;
      });
    }
  }, []);

  const handleCancelClick = () => {
    setMessage({ file: null, text: "" });
    setInputValueChat({
      prevValue: "",
      currentValue: inputValueChat.prevValue,
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", file!);
      const response = await fetch(
        `${SERVER_URL}/50gram/${userId}/sendImageMessage`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token") as string,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("image message result ", result);

      const imageUrl: string = result.imageUrl;

      console.log("sending image message");

      sendMessage({
        text: inputValue,
        imageUrl,
        myId: userFromJwt()!._id,
        chatId: chat!._id,
        userId: userId!,
      });

      setMessage({ file: null, text: "" });
    } catch (err) {}
  };
  return (
    <div className={cl.imageMessage}>
      <div className={cl.formWrapper}>
        <div className={cl.imageWrapper}>
          <img src="" alt="" ref={imgRef} />
        </div>

        <form onSubmit={handleFormSubmit} className={cl.form}>
          <div className={cl.inputWrapper}>
            <input
              className={cl.messageInput}
              type="text"
              name="message"
              placeholder="Caption"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
          <div className={cl.buttonsWrapper}>
            <button
              className={cl.cancelButton}
              type="button"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button className={cl.sendButton}>Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
