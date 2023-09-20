import { Chat } from "../hooks/useChat";
import { MessageInterface } from "../interfaces/interfaces";

export default function pushLoadedMessages(
  prevChat: Chat,
  messages: MessageInterface[]
) {
  const newChat = { ...prevChat };
  const newMessages = [...prevChat!.messages];

  newChat.messages = newMessages.concat(messages);

  return newChat;
}
