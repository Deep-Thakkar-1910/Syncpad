import { handleChatEvent } from "./helpers/handleChatEvent";

export type SocketEvent =
  | {
      type: "init_presence";
      payload: ChatUser[];
    }
  | {
      type: "member_added";
      payload: ChatUser;
    }
  | {
      type: "member_removed";
      payload: ChatUser;
    }
  | {
      type: "chat";
      payload: ChatMessage;
    }
  | {
      type: "empty_memberlist";
    }
  | {
      type: "empty_memberlist_and_messages";
    };
export interface ChatUser {
  id: string;
  image: string;
  name: string;
}

export interface ChatMessage {
  type: "chat" | "system";
  message?: string;
  timestamp: Date;
  user?: ChatUser;
}

export class ChatSocketManager {
  private socket: WebSocket | null = null;
  private roomId: string | null = null;
  private token: string | null = null;
  private shouldReconnect: boolean = true;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(roomId: string, token: string) {
    this.shouldReconnect = true;

    if (this.socket) {
      const isSameRoom = this.roomId === roomId && this.token === token;
      const isSocketUsable =
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING;

      if (isSameRoom && isSocketUsable) return this.socket;

      this.socket.close();
      this.socket = null;
    }

    this.roomId = roomId;
    this.token = token;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_CONNECTION_URL}/chat/${roomId}?token=${token}`,
    );
    this.socket = ws;

    ws.onopen = () => {
      // reset all reconnection attempts if any
      this.reconnectAttempts = 0;
      console.info("WebSocket connection established");
    };
    ws.onclose = () => {
      this.socket = null;

      // reconnection logic
      if (this.shouldReconnect) {
        handleChatEvent({ type: "empty_memberlist" });
        this.scheduleReconnect();
      }
      console.info("WebSocket connection closed");
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data); // this will fail for yjs so don't return in catch statement or yjs logic will break
        this.dispatch(parsedMessage);
      } catch (err) {
        console.error("Invalid Message received: ", err);
      }
    };
    return ws;
  }
  dispatch(event: SocketEvent) {
    // handle all chat events on receiving messages from websockets
    handleChatEvent(event);
  }

  send(message: SocketEvent) {
    if (!this.isConnected()) return;
    this.socket?.send(JSON.stringify(message));
  }

  private scheduleReconnect() {
    if (!this.roomId || !this.token) return;
    if (this.reconnectTimer) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 10000); // double the delay on every retry Max 10 second delay

    console.log(`Reconnecting in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempts++;

      this.connect(this.roomId!, this.token!);
    }, delay);
  }

  disconnect() {
    // cleanup and prevent reconnection
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close();
    }
    this.socket = null; // make socket instance null
    handleChatEvent({ type: "empty_memberlist_and_messages" });
  }

  private isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
