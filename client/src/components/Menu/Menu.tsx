import { useNavigate } from "react-router";
import UserCardPersonal from "../UserCards/UserCardPersonal";
import cl from "./Menu.module.scss";
import { useRef } from "react";
import { MenuProps } from "../../interfaces/interfaces";

export default function Menu({ menuVisible, setMenuVisible }: MenuProps) {
  const menuBgRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const menuContainerClass = menuVisible
    ? `${cl.menuContainer} ${cl.menuContainerVisible}`
    : `${cl.menuContainer}`;

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    navigate("/log-in");
  };

  const handleMenuBgRefClick = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className={menuContainerClass}>
      <div className={cl.menu}>
        <UserCardPersonal menuVisible={menuVisible} />
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
  );
}
