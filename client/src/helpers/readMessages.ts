import { Chat } from "../hooks/useChat";

export default function readMessages(prevChat: Chat) {
  const copyChat = { ...prevChat };
  const copyMessages = [...prevChat.messages];
  copyMessages.forEach((message) => (message.isRead = true));

  copyChat.messages = copyMessages;
  console.log("read messages", copyChat);

  return copyChat;
}
