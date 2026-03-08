import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";

import { User } from "better-auth";
import { ChatMessage, ChatUser } from "@/lib/chatSocketManager";

interface RoomChatInputProps {
  user: Partial<User>;
}

const RoomChatInput = ({ user }: RoomChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const socket = useChat((state) => state.socket);
  const addMessage = useChat((state) => state.addMessage);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() === "") return;
    const message: ChatMessage = {
      type: "chat",
      timestamp: new Date(),
      message: inputValue,
      user: user as unknown as ChatUser,
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      addMessage(message);
      setInputValue("");
      inputRef.current?.focus();
    }
  }, [inputValue, user, socket, addMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addMessage, socket, handleSendMessage]);

  return (
    <InputGroup className="bg-background! w-full max-w-sm">
      <InputGroupTextarea
        className="no-scrollbar h-20 w-full flex-none resize-none overflow-y-scroll break-all whitespace-pre-wrap"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ref={inputRef}
      />
      <InputGroupAddon align="block-end">
        <InputGroupText className="mr-auto">{inputValue.length}</InputGroupText>
        <InputGroupButton
          className="ml-2 cursor-pointer"
          size="sm"
          variant="default"
          onClick={handleSendMessage}
        >
          Send
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default RoomChatInput;
