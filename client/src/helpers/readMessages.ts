import { Chat } from "../hooks/useChat";

export default function readMessages(prevChat: Chat) {
  const copyChat = { ...prevChat };
  const copyMessages = prevChat.messages.map((message) => ({
    ...message,
    isRead: true,
  }));

  copyChat.messages = copyMessages;

  return copyChat;
}
