import { useState } from "react";
import { SidebarInterface } from "../../interfaces/interfaces";
import UserCard from "../UserCard/UserCard";
import cl from "./Sidebar.module.scss";
import burger from "/icons/hamburger.svg";

import { NavLink, useNavigate } from "react-router-dom";
import useUserList from "../../hooks/useUserList";
import useOnline from "../../hooks/useOnline";
import isOnline from "../../helpers/isOnline";

export default function Sidebar() {
  const { users, loading } = useUserList();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const { usersOnline } = useOnline();

  const handleBurgerClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    navigate("/log-in");
  };
  return (
    <div className={cl.sidebar}>
      <div className={cl.header}>
        <div className={cl.burger} onClick={handleBurgerClick}>
          <img src={burger} alt="" />
        </div>
        <div className={cl.title}>50gram</div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : !users.length ? (
        <div className={cl.text}>No people yet</div>
      ) : (
        users
          .sort((a, b) => {
            if (isOnline(usersOnline, a) && !isOnline(usersOnline, b)) {
              return -1;
            } else if (isOnline(usersOnline, b) && !isOnline(usersOnline, a)) {
              return 1;
            } else {
              return 0;
            }
          })
          .map((user) => {
            return (
              <NavLink to={`/${user._id}`} key={user._id}>
                <UserCard user={user} isOnline={isOnline(usersOnline, user)} />
              </NavLink>
            );
          })
      )}
      {menuVisible && (
        <div className={cl.menu}>
          <UserCard editOn={true} />
          <button type="button" onClick={handleLogOutClick}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
