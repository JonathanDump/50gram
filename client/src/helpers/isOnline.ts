import { IUserIds, UserInterface } from "../interfaces/interfaces";

export default function isOnline(
  usersOnline: IUserIds[],
  userId: string
): boolean {
  return !!usersOnline.find((userIds) => userIds.userId === userId);
}
