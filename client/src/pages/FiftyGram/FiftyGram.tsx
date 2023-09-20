import { useOutlet, useParams } from "react-router-dom";
import cl from "./FiftyGram.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import useOnline from "../../hooks/useOnline";
import { useEffect, useState } from "react";

export default function FiftyGram() {
  const { usersOnline } = useOnline();
  const [isWindowNarrow, setIsWindowNarrow] = useState(false);
  const outlet = useOutlet({ usersOnline, isWindowNarrow });
  const screenWidth = window.matchMedia("(max-width: 600px)");
  const { userId } = useParams();
  const chatContainerClass =
    isWindowNarrow && userId
      ? `${cl.chatContainer} ${cl.narrow} ${cl.visible}`
      : isWindowNarrow
      ? `${cl.chatContainer} ${cl.narrow}`
      : `${cl.chatContainer}`;

  useEffect(() => {
    screenWidth.matches && setIsWindowNarrow(true);
    screenWidth.onchange = (e) => {
      if (e.matches) {
        setIsWindowNarrow(true);
        console.log("width < 600");
      } else {
        setIsWindowNarrow(false);
        console.log("width > 600");
      }
    };
  }, []);

  return (
    <AuthProvider>
      <div className={cl.fiftyGram}>
        <div className={cl.window}>
          <Sidebar usersOnline={usersOnline} isWindowNarrow={isWindowNarrow} />

          <div className={chatContainerClass}>
            {outlet ||
              (!isWindowNarrow && (
                <div className={cl.componentStatus}>
                  Choose chat to start messaging
                </div>
              ))}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
