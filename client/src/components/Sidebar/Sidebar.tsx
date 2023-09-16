import { useRef, useState } from "react";
import { SidebarInterface } from "../../interfaces/interfaces";
import UserCard from "../UserCard/UserCard";
import cl from "./Sidebar.module.scss";
import burger from "/icons/hamburger.svg";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import useUserList from "../../hooks/useUserList";
import useOnline from "../../hooks/useOnline";
import isOnline from "../../helpers/isOnline";

export default function Sidebar() {
  const { users, loading } = useUserList();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const { usersOnline } = useOnline();
  const menuBgRef = useRef<HTMLDivElement | null>(null);
  const { userId } = useParams();

  const menuContainerClass = menuVisible
    ? `${cl.menuContainer} ${cl.menuContainerVisible}`
    : `${cl.menuContainer}`;

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
    <>
      <div className={cl.sidebar}>
        <div className={cl.header}>
          <div className={cl.burger} onClick={handleBurgerClick}>
            <img src={burger} alt="" />
          </div>
          <NavLink to="/" className={cl.title}>
            50gram
          </NavLink>
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
                let isSelected = userId === user._id;

                return (
                  <NavLink to={`/${user._id}`} key={user._id}>
                    <UserCard
                      user={user}
                      isOnline={isOnline(usersOnline, user)}
                      isSelected={isSelected}
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
      </div>
      <div className={menuContainerClass}>
        <div className={cl.menu}>
          <UserCard editOn={true} menuVisible={menuVisible} />
          <button type="button" onClick={handleLogOutClick}>
            Log Out
          </button>
        </div>
        <div
          className={cl.menuBg}
          ref={menuBgRef}
          onClick={handleMenuBgRefClick}
        ></div>
      </div>
    </>
  );
}
