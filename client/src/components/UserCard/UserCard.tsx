import { ChangeEvent, FormEvent, InvalidEvent, useRef, useState } from "react";
import { DecodedJwt, UserCardInterface } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";
import editIcon from "/icons/edit.svg";
import jwtDecode from "jwt-decode";

export default function UserCard({ user, editOn }: UserCardInterface) {
  const decodedJwt = jwtDecode(
    localStorage.getItem("token") as string
  ) as DecodedJwt;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const [settingsOn, setSettingsOn] = useState(true);

  const [buttonsOn, setButtonsOn] = useState(false);
  const [inputValue, setInputValue] = useState<{
    name: string;
    image: Blob | null;
  }>({
    name: decodedJwt.user.name,
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  console.log(inputValue);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar") {
      if (e.target.files![0]) {
        setInputValue({ ...inputValue, image: e.target.files![0] });

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files![0]);

        reader.addEventListener("load", () => {
          imgRef.current!.src = reader.result as string;
        });
      }
    } else if (e.target.name === "name") {
      e.target.setCustomValidity("");
      const name = e.target.value;
      setInputValue({ ...inputValue, name: name });
    }
  };

  const handleImageClick = () => {
    if (!editOn) {
      return;
    }
    setButtonsOn(true);
    inputRef.current!.click();
  };

  const handleCancelClick = () => {
    setButtonsOn(false);
    setIsEditing(false);
    setInputValue({ ...inputValue, name: decodedJwt.user.name });
    imgRef.current!.src = decodedJwt.user.img;
  };

  const handleNameClick = () => {
    if (!editOn) {
      return;
    }
    setButtonsOn(true);
    setIsEditing(true);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.name === decodedJwt.user.name && !inputValue.image) {
      setIsEditing(false);
      // setSettingsOn(false);
      return;
    }
    try {
      const URL = import.meta.env.VITE_API_ENDPOINT;
      const token = localStorage.getItem("token") as string;
      const formData = new FormData();
      formData.append("name", inputValue.name);
      formData.append("id", decodedJwt.user.id);
      inputValue.image && formData.append("avatar", inputValue.image);

      const response = await fetch(`${URL}/50gram/user/update`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Couldn't update the user");
      }

      const result = await response.json();
      console.log("result", result);

      localStorage.setItem("token", result.token);
      setButtonsOn(false);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };
  if (!editOn) {
    return (
      <div className={cl.UserCard}>
        <div className={cl.avatarContainer}>
          <img src={user!.img} alt="" className={cl.avatar} ref={imgRef} />
        </div>
        <div className={cl.name} onClick={handleNameClick}>
          {user!.name}
        </div>
      </div>
    );
  }

  return (
    <div className={cl.UserCard}>
      <div className={cl.avatarContainer} onClick={handleImageClick}>
        <input
          type="file"
          ref={inputRef}
          id="imgUpload"
          name="avatar"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
        <img
          src={decodedJwt.user!.img}
          alt=""
          className={cl.avatar}
          ref={imgRef}
        />
      </div>

      {isEditing ? (
        <input
          form="editForm"
          type="text"
          name="name"
          value={inputValue!.name}
          onChange={handleInputChange}
          minLength={1}
          title="At least 1 character long"
          required
          onInvalid={(e: InvalidEvent<HTMLInputElement>) =>
            e.target.setCustomValidity("At least 1 character long")
          }
        />
      ) : (
        <div className={cl.name} onClick={handleNameClick}>
          {decodedJwt.user.name}
          {editOn && <img src={editIcon} alt="" className={cl.icon} />}
        </div>
      )}

      {buttonsOn && (
        <div className={cl.buttonsContainer}>
          <form
            id="editForm"
            className={cl.editForm}
            onSubmit={handleFormSubmit}
            encType="multipart/form-data"
          >
            <button type="button" onClick={handleCancelClick}>
              Cancel
            </button>
            <button>Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
