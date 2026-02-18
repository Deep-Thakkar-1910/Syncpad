import { createServer } from "https";
import { WebSocketServer } from "ws";
const server = createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});

server.listen(process.env.PORT || 8000);
