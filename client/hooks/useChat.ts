import { ChatMessage, ChatUser } from "@/lib/chatSocketManager";
import { create } from "zustand";

type ChatStore = {
  chatOpen: boolean;
  socket: WebSocket | null;
  toggleChat: () => void;
  closeChat: () => void;
  members: ChatUser[];
  messages: ChatMessage[];
  setInitMembers: (initMembers: ChatUser[]) => void;
  addMember: (newMember: ChatUser) => void;
  removeMember: (rmovedMember: ChatUser) => void;
  addMessage: (newMessage: ChatMessage) => void;
  resetMembers: () => void;
  resetMessages: () => void;
  setSocket: (socket: WebSocket | null) => void;
};

export const useChat = create<ChatStore>((set) => ({
  chatOpen: false,
  members: [],
  messages: [],
  socket: null,
  toggleChat: () => set(({ chatOpen }) => ({ chatOpen: !chatOpen })),
  closeChat: () => set(() => ({ chatOpen: false })),
  setInitMembers: (initMembers) =>
    set(({ messages }) => {
      const hasInitMessage = messages.some(
        (msg) => msg.type === "system" && msg.message === "Chat Initialized",
      );

      return {
        members: initMembers,
        messages: hasInitMessage
          ? messages
          : [
              ...messages,
              {
                timestamp: new Date(),
                message: "Chat Initialized",
                type: "system",
              },
            ],
      };
    }),
  addMember: (newMember) =>
    set(({ members, messages }) => {
      const memberAlreadyPresent = members.some((mem) => mem.id === newMember.id);

      return {
        members: memberAlreadyPresent ? members : [...members, newMember],
        messages: memberAlreadyPresent
          ? messages
          : [
              ...messages,
              {
                timestamp: new Date(),
                message: `${newMember.name} Joined`, // Add a new member joined message to show in chat preview
                type: "system",
              },
            ],
      };
    }) /* Add a new member only if the member isn't already present 
    (reconnect case where the user might not have been removed from members array yet)*/,
  removeMember: (removedMember) =>
    set(({ members, messages }) => {
      const memberWasPresent = members.some((mem) => mem.id === removedMember.id);

      return {
        members: members.filter((mem) => mem.id !== removedMember.id),
        messages: memberWasPresent
          ? [
              ...messages,
              {
                timestamp: new Date(),
                message: `${removedMember.name} Left`, // Add a member left message to show in chat preview
                type: "system",
              },
            ]
          : messages,
      };
    }),
  addMessage: (newMessage) =>
    set(({ messages }) => ({ messages: [...messages, newMessage] })),

  resetMessages: () => set(() => ({ messages: [] })),
  resetMembers: () => set(() => ({ members: [] })),
  setSocket: (socket) => set(() => ({ socket })),
}));
