"use client";

import RoomChatPreview from "./RoomChat/RoomChatPreview";
import RoomChatInput from "./RoomChat/RoomChatInput";
import { User } from "better-auth";

interface ChatSidebarProps {
  isOpen: boolean;
  user: Partial<User>;
}

export default function ChatSidebar({ isOpen, user }: ChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-10 bottom-24 flex flex-col justify-end gap-y-10 overflow-y-scroll">
      <RoomChatPreview user={user} />
      <RoomChatInput user={user} />
    </div>
  );
}
