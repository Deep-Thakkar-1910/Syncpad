import { useChat } from "@/hooks/useChat";
import { SocketEvent } from "../chatSocketManager";

export const handleChatEvent = (event: SocketEvent) => {
  const chatStore = useChat.getState();
  switch (event.type) {
    case "empty_memberlist": {
      chatStore.resetMembers();
      break;
    }
    case "empty_memberlist_and_messages": {
      chatStore.resetMembers();
      chatStore.resetMessages();
      break;
    }
    case "chat": {
      chatStore.addMessage(event.payload);
      break;
    }
    case "init_presence": {
      chatStore.setInitMembers(event.payload);
      break;
    }
    case "member_added": {
      chatStore.addMember(event.payload);
      break;
    }
    case "member_removed": {
      chatStore.removeMember(event.payload);
      break;
    }
    default:
      break;
  }
};
