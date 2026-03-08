import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { User } from "better-auth";
import { useEffect, useRef } from "react";

interface RoomChatPreviewProps {
  user: Partial<User>;
}
const RoomChatPreview = ({ user }: RoomChatPreviewProps) => {
  const messages = useChat((state) => state.messages);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const viewport = root.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement | null;
    if (!viewport) return;

    const updateScrollIntent = () => {
      const distanceFromBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      shouldAutoScrollRef.current = distanceFromBottom < 80;
    };

    viewport.addEventListener("scroll", updateScrollIntent);
    updateScrollIntent();

    return () => {
      viewport.removeEventListener("scroll", updateScrollIntent);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!user) return null;
  return (
    <div className="w-96 min-w-0">
      <div className="text-foreground bg-background h-10 rounded-t-md border border-b-0 p-2">
        <p className="text-center text-sm">Chat Preview</p>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="bg-background h-96 rounded-b-md border"
      >
        <div className="space-y-4 p-4">
          {messages.map((msg, idx) => {
            const isMe = msg.user?.id === user?.id;

            // SYSTEM MESSAGE
            if (msg.type === "system") {
              return (
                <div key={idx} className="mt-2 mb-8 flex justify-center">
                  <Badge variant={"secondary"} className="text-sm">
                    {msg.message}
                  </Badge>
                </div>
              );
            }

            // MY MESSAGE
            if (isMe) {
              return (
                <div key={idx} className="flex min-w-0 flex-col items-end">
                  <div className="bg-primary max-w-[85%] rounded-lg px-3 py-2 text-sm shadow">
                    <p className="break-all whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-muted-foreground mt-2 text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            }

            // OTHER USER MESSAGE
            return (
              <div key={idx} className="flex items-start justify-start gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={msg.user?.image} />
                  <AvatarFallback>
                    {msg.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-muted-foreground mb-1 text-xs">
                    {msg.user?.name}
                  </span>

                  <div className="bg-muted w-fit max-w-[90%] rounded-lg px-3 py-2 text-sm shadow">
                    <p className="leading-relaxed break-all whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  <span className="text-muted-foreground mt-2 text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoomChatPreview;
