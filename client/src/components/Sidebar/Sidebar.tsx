import { useState } from "react";
import { DecodedJwt, SidebarInterface } from "../../interfaces/interfaces";
import UserCard from "../UserCard/UserCard";
import cl from "./Sidebar.module.scss";
import burger from "/icons/hamburger.svg";
import jwtDecode from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ users }: SidebarInterface) {
  const [menuVisible, setMenuVisible] = useState(true);
  const navigate = useNavigate();
  const myInfo = jwtDecode(
    localStorage.getItem("token") as string
  ) as DecodedJwt;

  console.log(myInfo);

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
      {!users.length ? (
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
          <UserCard user={myInfo.user} editOn={true} />
          <button type="button" onClick={handleLogOutClick}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
