import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createRemoteJWKSet, jwtVerify } from "jose";
const wss = new WebSocketServer({ host: "0.0.0.0", port: 8080 });

// Standardize what a payload looks like to clients
interface MessagePayload {
  type: string;
  roomId: string;
  pageData: any; // Can be a string OR an object now
}

const rooms = new Map<string, Set<WebSocket>>();
const roomStates = new Map<string, string>();
const JWKS = createRemoteJWKSet(new URL("http://localhost:3000/api/auth/jwks"));

wss.on("connection", async function connection(ws, request) {
  ws.on("error", console.error);

  // ─── 1. Authentication Layer ───
  const url = request.url;
  if (!url) {
    ws.close(4003, "URL Missing");
    return;
  }

  try {
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    console.log(token);
    const { payload } = await jwtVerify(token, JWKS);
    // optional extra check
    if (!payload.sub) {
      console.error("Auth Error:");
      ws.close(4003, "Invalid token");
      return;
    }

    ws.send(JSON.stringify({ type: "connection:ready" }));
  } catch (error) {
    console.error("Auth Error:", error);
    ws.close(4003, "Authentication Failed");
    return; // Stop execution! Do not attach message listeners.
  }

  // ─── 2. Communication Layer (Only attached if authenticated) ───
  ws.on("message", function message(data) {
    let parsedData: MessagePayload;
    try {
      parsedData = JSON.parse(data.toString());
    } catch {
      return; // Silently ignore malformed JSON payload frames
    }

    const { type, roomId, pageData } = parsedData;

    if (type === "join") {
      if (!rooms.has(roomId)) {
        console.log(`Creating new room: ${roomId}`);
        rooms.set(roomId, new Set<WebSocket>());
      }
      rooms.get(roomId)?.add(ws);
      const roomJoinedData = {
        type: "roomJoined",
        roomId,
        pageData: true,
      };
      ws.send(JSON.stringify(roomJoinedData));

      const cachedState = roomStates.get(roomId);
      if (cachedState) {
        ws.send(cachedState);
      }
    } else if (type === "page:sync") {
      const room = rooms.get(roomId);
      // Verify room exists and sender belongs to it
      if (room && room.has(ws)) {
        // Broadcast the entire raw message (which includes the 'type' field)
        const rawPayload = data.toString();
        roomStates.set(roomId, rawPayload);

        room.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(rawPayload);
          }
        });
      }
    }
  });

  // ─── 3. Cleanup Layer ───
  ws.on("close", () => {
    rooms.forEach((clients, id) => {
      clients.delete(ws);
      if (clients.size === 0) {
        rooms.delete(id); // Garbage collect empty rooms
        roomStates.delete(id); // Garbage collect empty room states
      }
    });
  });
});
