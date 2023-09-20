import { redirect, useNavigate, useOutlet } from "react-router-dom";
import cl from "./FiftyGram.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import useOnline from "../../hooks/useOnline";

export default function FiftyGram() {
  const { usersOnline } = useOnline();
  const outlet = useOutlet({ usersOnline });
  return (
    <AuthProvider>
      <div className={cl.fiftyGram}>
        <div className={cl.window}>
          <Sidebar usersOnline={usersOnline} />
          {outlet || (
            <div className={cl.componentStatus}>
              Choose chat to start messaging
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
}
