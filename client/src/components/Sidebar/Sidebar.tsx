import { useState } from "react";
import { SidebarParams } from "../../interfaces/interfaces";
import UserCard from "../UserCards/UserCard";
import cl from "./Sidebar.module.scss";
import { ReactComponent as Burger } from "/public/icons/burger.svg";

import { NavLink, useParams } from "react-router-dom";
import useUserList from "../../hooks/useUserList";

import isOnline from "../../helpers/isOnline";

import Menu from "../Menu/Menu";

export default function Sidebar({
  usersOnline,
  isWindowNarrow,
}: SidebarParams) {
  const { users, loading, setUsers } = useUserList();

  const [menuVisible, setMenuVisible] = useState(false);

  const { userId } = useParams();

  const sidebarClass =
    isWindowNarrow && userId ? `${cl.sidebar} ${cl.narrow}` : `${cl.sidebar}`;

  const handleBurgerClick = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <div className={sidebarClass}>
        <div className={cl.header}>
          <div className={cl.burger} onClick={handleBurgerClick}>
            <Burger />
          </div>
          <NavLink to="/" className={cl.title}>
            50gram
          </NavLink>
        </div>
        <div className={cl.userList}>
          {loading ? (
            <div className={cl.status}>Loading...</div>
          ) : !users.length ? (
            <div className={cl.status}>No people yet</div>
          ) : (
            users
              .sort((a, b) => {
                if (
                  isOnline(usersOnline, a._id) &&
                  !isOnline(usersOnline, b._id)
                ) {
                  return -1;
                } else if (
                  isOnline(usersOnline, b._id) &&
                  !isOnline(usersOnline, a._id)
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
                      isOnline={isOnline(usersOnline, user._id)}
                      isSelected={isSelected}
                      setUsers={setUsers}
                      users={users}
                    />
                  </NavLink>
                );
              })
          )}
        </div>
      </div>
      <Menu menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
    </>
  );
}
