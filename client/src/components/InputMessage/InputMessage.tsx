import cl from "./InputMessage.module.scss";
import btn from "../../scss/button.module.scss";
import { ReactComponent as AttachmentsIcon } from "/public/icons/attachmentsImg.svg";
import { InputMessageProps } from "../../interfaces/interfaces";

export default function InputMessage({
  handleFormSubmit,
  handleAttachmentsClick,
  handleInputChange,
  inputFileRef,
  inputTextRef,
}: InputMessageProps) {
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
  );
}
