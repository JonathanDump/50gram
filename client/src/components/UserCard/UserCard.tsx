import React, { ChangeEvent, useRef, useState } from "react";
import { UserCardInterface } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";

export default function UserCard({ user, editOn }: UserCardInterface) {
  const inputRef = useRef(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [settingsOn, setSettingsOn] = useState(true);
  const [inputAvatar, setInputAvatar] = useState<object | null>(null);
  console.log(inputAvatar);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setInputAvatar(e.target.files![0]);

      const reader = new FileReader();
      reader.readAsDataURL(e.target.files![0]);

      reader.addEventListener("load", () => {
        imgRef.current.src = reader.result;
      });
    }
  };
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleCancelClick = () => {
    setSettingsOn(false);
    imgRef.current.src = user.img;
  };
  return (
    <div className={cl.UserCard}>
      {editOn && (
        <input
          type="file"
          ref={inputRef}
          id="imgUpload"
          name="avatar"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      )}
      <img
        src={user.img}
        alt=""
        className={cl.avatar}
        onClick={handleImageClick}
        ref={imgRef}
      />

      <div className={cl.name}>{user.name}</div>

      {editOn && settingsOn && (
        <div className={cl.buttonsContainer}>
          <button type="button" onClick={handleCancelClick}>
            Cancel
          </button>
          <button type="button">Save</button>
        </div>
      )}
    </div>
  );
}
