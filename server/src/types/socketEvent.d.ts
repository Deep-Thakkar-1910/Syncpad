type SocketEvent =
  | {
      type: "init_presence";
      payload: UserMeta[];
    }
  | {
      type: "member_added";
      payload: UserMeta;
    }
  | {
      type: "member_removed";
      payload: UserMeta;
    }
  | {
      type: "chat";
      payload: ChatMessage;
    };
