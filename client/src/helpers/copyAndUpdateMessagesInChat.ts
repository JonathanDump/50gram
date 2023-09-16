import { Chat } from "../hooks/useChat";
import { ChatInterface, MessageInterface } from "../interfaces/interfaces";

export default function copyAndUpdateMessagesInChat(
  prevChat: Chat,
  messages: MessageInterface[]
) {
  const newChat = { ...prevChat };
  const newMessages = [...prevChat!.messages];

  newChat.messages = newMessages.concat(messages);
  return newChat;
}
