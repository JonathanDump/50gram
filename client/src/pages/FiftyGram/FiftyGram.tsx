import { redirect, useNavigate, useOutlet } from "react-router-dom";
import cl from "./FiftyGram.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SERVER_URL } from "../../config/config";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import ImageMessage from "../../components/ImageMessage/ImageMessage";
import { useRef, useState } from "react";
import { IMessage } from "../../interfaces/interfaces";

// export const loader = async () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return redirect("/log-in");
//   }

//   const response = await fetch(`${SERVER_URL}/50gram`, {
//     headers: {
//       Authorization: token,
//     },
//   });

//   if (!response.ok) {
//     throw new Error();
//   }

//   const { users } = await response.json();
//   console.log(users);

//   return users;
// };

export default function FiftyGram() {
  // const users = useLoaderData() as UserInterface[];

  // const [message, setMessage] = useState<IMessage>({ file: null, text: "" });
  // console.log("messageRef fifty gram", message);

  const outlet = useOutlet();
  return (
    <AuthProvider>
      <div className={cl.fiftyGram}>
        <div className={cl.window}>
          <Sidebar />
          {/* <div className={cl.chatContainer}> */}
          {outlet || <div>Choose chat to start messaging</div>}
          {/* </div> */}
        </div>
        {/* {message.file && (
          <ImageMessage
            file={message.file}
            text={message.text}
            setMessage={setMessage}
          />
        )} */}
      </div>
    </AuthProvider>
  );
}
