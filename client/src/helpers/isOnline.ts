import { IUserIds, UserInterface } from "../interfaces/interfaces";

export default function isOnline(
  usersOnline: IUserIds[],
  user: UserInterface
): boolean {
  return !!usersOnline.find((userIds) => userIds.userId === user!._id);
}
