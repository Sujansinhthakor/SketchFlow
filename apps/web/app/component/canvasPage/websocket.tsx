import { Editor } from "@dgmjs/core";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const useWebSocket = (
  editor: Editor | null,
  roomId?: string,
  enabled: boolean = true,
  token?: string,
) => {
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const lastSentData = useRef<string | null>(null);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  const isApplyingRemoteChange = useRef(false);

  useEffect(() => {
    if (!editor || !roomId || !enabled) {
      setIsWsConnected(false);
      setIsConnecting(false);
      return;
    }

    if (!token) return;

    const wsURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const ws = new WebSocket(`${wsURL}?token=${token}`);
    setIsConnecting(true);

    ws.onopen = () => {
      console.log("WebSocket connected. Waiting for backend authentication...");
    };

    // 1. Listen for INCOMING full page changes
    ws.onmessage = async (event) => {
      let rawData: string;
      if (event.data instanceof Blob) {
        rawData = await event.data.text();
      } else {
        rawData = typeof event.data === "string" ? event.data : event.data.toString();
      }

      let data: any;
      try {
        data = JSON.parse(rawData);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err, "Raw data:", rawData);
        return;
      }

      if (data.type === "connection:ready") {
        console.log("Authentication successful! Joining room", roomId);
        setIsWsConnected(true);
        ws.send(JSON.stringify({ type: "join", roomId }));

        const fullDocData = editor.saveToJSON();
        if (fullDocData) {
          let hasShapes = false;

          // Remove the scroll/camera position
          if (fullDocData.children) {
            const page = fullDocData.children.find(
              (c: any) => c.type === "Page",
            );
            if (page) {
              delete page.pageOrigin;
              if (page.children && page.children.length > 0) {
                hasShapes = true;
              }
            }
          }

          // Initialize lastSentData to the normalized JSON immediately.
          // This prevents the new user's initial local repaint from broadcasting an empty canvas.
          lastSentData.current = JSON.stringify(fullDocData);

          // Only send if the canvas is not empty
          if (hasShapes) {
            ws.send(
              JSON.stringify({
                type: "page:sync",
                roomId,
                pageData: fullDocData,
              }),
            );
          }
        }
      }

      if (data.type === "roomJoined") {
        setIsConnecting(false);
        if (data.pageData === true) {
          toast.success("Room Joined Successfully", {
            position: "bottom-right",
          });
        }
      }

      if (data.type === "page:sync") {
        console.log("receiveing data", data);
        isApplyingRemoteChange.current = true;

        // Preserve our local camera position before loading remote data
        const localPage = editor.getCurrentPage();
        if (localPage && data.pageData.children) {
          const remotePage = data.pageData.children.find(
            (c: any) => c.type === "Page",
          );
          if (remotePage) {
            // Overwrite the remote camera position with our local one!
            remotePage.pageOrigin = localPage.pageOrigin;
            remotePage.pageScale = localPage.pageScale;
          }
        }

        // Load the new page state
        editor.loadFromJSON(data.pageData);

        // Update lastSentData after receiving remote changes
        // This prevents the next local repaint from echoing the remote state back to the room.
        const updatedDocData = editor.saveToJSON();
        if (updatedDocData && updatedDocData.children) {
          const page = updatedDocData.children.find(
            (c: any) => c.type === "Page",
          );
          if (page) delete page.pageOrigin;
          lastSentData.current = JSON.stringify(updatedDocData);
        }

        // Wait for React/Canvas to finish rendering before we re-enable local sending
        setTimeout(() => {
          isApplyingRemoteChange.current = false;
        }, 50);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsWsConnected(false);
      setIsConnecting(false);

      if (event.code === 4003) {
        toast.error("Authentication failed. Please login again.");
      } else if (!event.wasClean) {
        toast.error("WebSocket connection failed.");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsWsConnected(false);
      setIsConnecting(false);
    };

    // 2. Listen for LOCAL canvas repaints
    const handleRepaint = () => {
      if (isApplyingRemoteChange.current) return;
      if (throttleTimeout.current) return;

      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;

        if (ws.readyState === WebSocket.OPEN) {
          const fullDocData = editor.saveToJSON();
          if (!fullDocData) return;

          if (fullDocData.children) {
            const page = fullDocData.children.find(
              (c: any) => c.type === "Page",
            );
            if (page) {
              delete page.pageOrigin;
            }
          }

          const newJsonString = JSON.stringify(fullDocData);

          if (newJsonString !== lastSentData.current) {
            lastSentData.current = newJsonString;
            ws.send(
              JSON.stringify({
                type: "page:sync",
                roomId,
                pageData: fullDocData,
              }),
            );
          }
        }
      }, 100); // 100ms throttle
    };

    editor.onRepaint.addListener(handleRepaint);

    return () => {
      setIsWsConnected(false);
      setIsConnecting(false);
      editor.onRepaint.removeListener(handleRepaint);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
      ws.close();
    };
  }, [editor, roomId, enabled, token]);

  return { isWsConnected, isConnecting };
};

export default useWebSocket;
