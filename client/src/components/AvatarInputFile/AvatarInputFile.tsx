import { useRef } from "react";
import cl from "./avatarInputFile.module.scss";
import { avatarInputFileProps } from "../../interfaces/interfaces";

export default function AvatarInputFile({
  editOn,
  imgRef,
  handleInputChange,
  setButtonsOn,
  decodedJwt,
}: avatarInputFileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    if (!editOn) {
      return;
    }
    console.log("avatarInput click");

    setButtonsOn && setButtonsOn(true);
    inputRef.current!.click();
  };
  return (
    <div className={cl.avatarInputFile} onClick={handleImageClick}>
      <input
        type="file"
        ref={inputRef}
        id="imgUpload"
        name="avatar"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
      <div className={cl.imgContainer}>
        <img
          src={decodedJwt?.user.img}
          alt=""
          className={cl.avatar}
          ref={imgRef}
        />
      </div>
    </div>
  );
}
