import cl from "./InputMessage.module.scss";
import btn from "../../scss/button.module.scss";
import { ReactComponent as AttachmentsIcon } from "/src/icons/attachmentsImg.svg";
import { ReactComponent as SendButtonIcon } from "/src/icons/sendButton.svg";

import { InputMessageProps } from "../../interfaces/interfaces";
import { useRef } from "react";

export default function InputMessage({
  handleFormSubmit,
  handleAttachmentsClick,
  handleInputChange,
  inputFileRef,
  inputTextRef,
}: InputMessageProps) {
  const sendButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendButtonRef.current!.click();
    }
  };
  return (
    <form className={cl.messageForm} onSubmit={handleFormSubmit}>
      <div className={cl.attachments} onClick={handleAttachmentsClick}>
        <AttachmentsIcon />
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
        className={cl.inputMessage}
        autoFocus
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
        onKeyDown={handleEnterKeyDown}
      ></div>
      <button className={btn.sendButton} ref={sendButtonRef}>
        <SendButtonIcon />
      </button>
    </form>
  );
}
