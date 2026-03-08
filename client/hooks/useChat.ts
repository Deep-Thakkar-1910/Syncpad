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
      const message: ChatMessage = {
        timestamp: new Date(),
        message: "Chat Initialzed",
        type: "system",
      };

      return {
        members: initMembers,
        messages: [...messages, message],
      };
    }),
  addMember: (newMember) =>
    set(({ members, messages }) => {
      const message: ChatMessage = {
        timestamp: new Date(),
        message: `${newMember.name} Joined`, // Add a new member joined message to show in chat preview
        type: "system",
      };

      return {
        members: members.some((mem) => mem.id === newMember.id)
          ? members
          : [...members, newMember],
        messages: [...messages, message],
      };
    }) /* Add a new member only if the member isn't already present 
    (reconnect case where the user might not have been removed from members array yet)*/,
  removeMember: (removedMember) =>
    set(({ members, messages }) => {
      const message: ChatMessage = {
        timestamp: new Date(),
        message: `${removedMember.name} Left`, // Add a member left message to show in chat preview
        type: "system",
      };

      return {
        members: members.filter((mem) => mem.id !== removedMember.id),
        messages: [...messages, message],
      };
    }),
  addMessage: (newMessage) =>
    set(({ messages }) => ({ messages: [...messages, newMessage] })),

  resetMessages: () => set(() => ({ messages: [] })),
  resetMembers: () => set(() => ({ members: [] })),
  setSocket: (socket) => set(() => ({ socket })),
}));
