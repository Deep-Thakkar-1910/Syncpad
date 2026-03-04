import { createServer } from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "@y/websocket-server/utils";
import { jwtVerify } from "jose";

const PORT = process.env.PORT || 8080;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "SUPER_SECRET",
); // Constructing Secret from the env.

const server = createServer();

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req, socket, head) => {
  try {
    const url = new URL(req.url!, `http://localhost`);

    const token = url.searchParams.get("token"); // extracting the token from searchParams
    const roomName = url.pathname.slice(1); // extracting room name from the path

    if (!token) throw new Error("Missing token"); // If there is no token present don't allow websocket connection.

    const decoded = await jwtVerify(token, JWT_SECRET); // decoding the jwt to get roomId
    const payload = decoded.payload;

    // Check if the user is allowed in the room or not
    const isAllowed = payload.roomId === roomName;
    if (!isAllowed) {
      // don't allow the user in the room if auth fails
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req); // allow connection if the auth passed
    });
  } catch (err) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n"); // on error as well restrict the user from connecting to the websocket
    socket.destroy();
  }
});

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req); // setup yjs relay server connection
});

server.listen(PORT, () => {
  console.log("Websocker Server Running");
});
