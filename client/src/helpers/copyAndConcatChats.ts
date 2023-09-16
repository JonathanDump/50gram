import { Chat } from "../hooks/useChat";

export default function copyAndConcatChats({
  prevChat,
  result,
}: {
  prevChat: Chat;
  result: Chat;
}) {
  const newChat = { ...prevChat };
  const newMessages = [...prevChat!.messages];

  newMessages.concat(result.messages);
  newChat.messages = newMessages;
  return newChat;
}
