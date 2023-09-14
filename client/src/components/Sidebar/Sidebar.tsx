import { useRef, useState } from "react";
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
  const menuBgRef = useRef<HTMLDivElement | null>(null);

  const menuClass = menuVisible ? `${cl.menu} ${cl.menuVisible}` : `${cl.menu}`;
  const menuBgClass = menuVisible
    ? `${cl.menuBg} ${cl.menuBgVisible}`
    : `${cl.menuBg}`;
  const burgerClass = document.body.hasAttribute("data-theme")
    ? `${cl.burger} ${cl.burgerDarkTheme}`
    : `${cl.burger}`;

  const handleBurgerClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    navigate("/log-in");
  };

  const handleMenuBgRefClick = () => {
    setMenuVisible(!menuVisible);
  };
  return (
    <div className={cl.sidebar}>
      <div className={cl.header}>
        <div className={burgerClass} onClick={handleBurgerClick}>
          <img src={burger} alt="" />
        </div>
        <div className={cl.title}>50gram</div>
      </div>
      <div className={cl.userList}>
        {loading ? (
          <div>Loading...</div>
        ) : !users.length ? (
          <div className={cl.text}>No people yet</div>
        ) : (
          users
            .sort((a, b) => {
              if (isOnline(usersOnline, a) && !isOnline(usersOnline, b)) {
                return -1;
              } else if (
                isOnline(usersOnline, b) &&
                !isOnline(usersOnline, a)
              ) {
                return 1;
              } else {
                return 0;
              }
            })
            .map((user) => {
              return (
                <NavLink to={`/${user._id}`} key={user._id}>
                  <UserCard
                    user={user}
                    isOnline={isOnline(usersOnline, user)}
                  />
                </NavLink>
              );
            })
        )}
      </div>
      {/* {menuVisible && (
        <div className={cl.menu}>
          <UserCard editOn={true} />
          <button type="button" onClick={handleLogOutClick}>
            Log Out
          </button>
          <div
            className={cl.menuBg}
            ref={menuBgRef}
            onClick={handleMenuBgRefClick}
          ></div>
        </div>
      )} */}

      <div className={menuClass}>
        <UserCard editOn={true} menuVisible={menuVisible} />
        <button type="button" onClick={handleLogOutClick}>
          Log Out
        </button>
      </div>
      <div
        className={menuBgClass}
        ref={menuBgRef}
        onClick={handleMenuBgRefClick}
      ></div>
    </div>
  );
}
