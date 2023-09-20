import { UserCardParams, UserInterface } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";

export default function UserCard({
  isSelected,
  user,
  users,
  setUsers,
  isOnline,
}: UserCardParams) {
  const userCardClass = isSelected
    ? `${cl.userCard} ${cl.userCardSelected}`
    : `${cl.userCard}`;

  const handleCardClick = () => {
    console.log("handle card click");
    if (!user?.newMessages || !users) {
      console.log("handle card click return");

      return;
    }

    const copyUsers = [...users];
    const usr = copyUsers.find((u: UserInterface) => u._id === user._id);
    if (usr) {
      console.log("handle card click setting new messages null");
      usr.newMessages = 0;
    }

    setUsers && setUsers(copyUsers);
  };

  return (
    <div className={userCardClass} onClick={handleCardClick}>
      <div className={cl.avatarContainer}>
        <img src={user!.img} alt="" className={cl.avatar} />
        {isOnline && <div className={cl.online}></div>}
      </div>
      <div className={cl.name}>{user!.name}</div>
      <div className={cl.notification}>
        {!!user?.newMessages && (
          <div className={cl.dot}>{user.newMessages}</div>
        )}
      </div>
    </div>
  );
}