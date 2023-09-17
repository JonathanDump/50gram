import { Chat } from "../hooks/useChat";
import { ChatInterface, MessageInterface } from "../interfaces/interfaces";

export default function unshiftNewMessage(
  prevChat: Chat,
  messages: MessageInterface
) {
  const newChat = { ...prevChat };
  const newMessages = [...prevChat!.messages];
  newMessages.unshift(messages);

  newChat.messages = newMessages;

  return newChat;
}
