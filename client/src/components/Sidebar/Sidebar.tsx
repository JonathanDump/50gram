import { useState } from "react";
import { SidebarInterface } from "../../interfaces/interfaces";
import UserCard from "../UserCard/UserCard";
import cl from "./Sidebar.module.scss";
import burger from "/icons/hamburger.svg";

import { NavLink, useNavigate } from "react-router-dom";
import useSidebar from "../../hooks/useSidebar";

export default function Sidebar() {
  const { users, loading } = useSidebar();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

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
        users.map((user) => {
          return (
            <NavLink to={`/${user._id}`} key={user._id}>
              <UserCard user={user} />
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
