import { UserCardParams, UserInterface } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";
import { ReactComponent as VerifiedIcon } from "/public/icons/verified.svg";

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
    
    if (!user?.newMessages || !users) {
      

      return;
    }

    const copyUsers = [...users];
    const usr = copyUsers.find((u: UserInterface) => u._id === user._id);
    if (usr) {
      
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
      <div className={cl.name}>
        {user!.name}{" "}
        {user.isVerified && (
          <div className={cl.verifiedIcon}>
            <VerifiedIcon />
          </div>
        )}
      </div>
      <div className={cl.notification}>
        {!!user?.newMessages && (
          <div className={cl.dot}>{user.newMessages}</div>
        )}
      </div>
    </div>
  );
}
