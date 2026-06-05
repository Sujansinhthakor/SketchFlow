"use client";
import { Editor, FillStyle, Shape, Text, type ShapeProps } from "@dgmjs/core";
import { DGMEditor } from "@dgmjs/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { Toolbar } from "./canvasComponent/toolbar";
import { Palette } from "./canvasComponent/palette";
import HeaderActions from "./canvasComponent/HeaderActions";
import useWebSocket from "./websocket";
import { authClient } from "../../lib/auth-client";
import api from "../../../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import ConnectingOverlay from "./canvasComponent/connectingOverlay";

declare global {
  interface Window {
    editor: Editor;
  }
}
interface CanvasProps {
  roomId?: string;
  mode?: Mode;
}
export enum Mode {
  Solo = "Solo",
  Multiplayer = "Multiplayer",
}

function Canvas({ roomId, mode }: CanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeHandler, setActiveHandler] = useState<string>("Select");
  const [token, setToken] = useState<string | undefined>();
  const [showPalette, setShowPalette] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ── NEW: Ref to track the shape currently being drawn ──
  const pendingShapeRef = useRef<Shape | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const setIsDarkMode = (dark: boolean) => setTheme(dark ? "dark" : "light");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await authClient.token();
        if (data?.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Failed to fetch token", err);
      }
    };
    fetchToken();
  }, []);

  const currentPropsRef = useRef<ShapeProps>({
    fillColor: "$blue4",
    strokeColor: "$blue9",
    fontSize: 16,
    strokeWidth: 1,
  });

  const { isWsConnected, isConnecting } = useWebSocket(
    editor,
    roomId,
    mode == Mode.Multiplayer,
    token,
  );

  const showConnectingOverlay = mode === Mode.Multiplayer && isConnecting;

  const handleMount = async (editor: Editor) => {
    window.editor = editor;
    setEditor(editor);
    editor.newDoc();

    editor.fitToScreen();
    window.addEventListener("resize", () => {
      editor.fit();
    });

    // ── NEW: Listen for the end of a drawing action ──
    editor.onPointerUp.addListener(() => {
      if (pendingShapeRef.current) {
        const shapeToSelect = pendingShapeRef.current;
        pendingShapeRef.current = null; // Clear it to avoid re-selecting

        // Short timeout ensures DGM has completely finished native state insertion
        setTimeout(() => {
          editor.selection.select([shapeToSelect], true);

          // Optional: Revert the tool back to "Select" automatically after drawing
          // editor.activateHandler("Select");
        }, 10);
      }
    });
  };

  const handleShapeInitialize = (shape: Shape) => {
    shape.fillStyle =
      shape instanceof Text ? FillStyle.NONE : FillStyle.HACHURE;

    const currentProps = currentPropsRef.current;
    if (currentProps.fillColor) shape.fillColor = currentProps.fillColor;
    if (currentProps.strokeColor) shape.strokeColor = currentProps.strokeColor;
    if (currentProps.fontSize) shape.fontSize = currentProps.fontSize;
    if (currentProps.strokeWidth) shape.strokeWidth = currentProps.strokeWidth;
    shape.fontFamily = "GeistSans";
    shape.roughness = 0.2;

    // ── NEW: If a creation tool is active, tag this shape as pending ──
    const activeHandlerId = window.editor?.getActiveHandler()?.id;
    if (
      activeHandlerId &&
      !["Select", "Hand", "Eraser"].includes(activeHandlerId)
    ) {
      pendingShapeRef.current = shape;
    }
  };

  const handlePropsChange = (props: ShapeProps) => {
    currentPropsRef.current = { ...currentPropsRef.current, ...props };
    window.editor?.actions.update(props);
  };

  useEffect(() => {
    if (
      !["Highlighter", "Eraser", "Select", "Hand", "Image"].includes(
        activeHandler,
      ) ||
      hasSelection
    ) {
      setShowPalette(true);
    } else {
      setShowPalette(false);
    }
  }, [activeHandler, hasSelection]);

  const { data: canvasData, isLoading: isCanvasLoading } = useQuery({
    queryKey: ["canvas", roomId],
    queryFn: async () => {
      const res = await api.get(`room/canvas/get/?slug=${roomId}`);
      return res.data;
    },
    enabled: !!roomId,
  });

  useEffect(() => {
    if (canvasData?.data && editor) {
      console.log("Loading canvas data...");
      editor.loadFromJSON(canvasData.data);
    }
  }, [canvasData, editor]);

  useEffect(() => {
    return () => {
      if (!editor || !roomId) return;

      const saveEditor = async () => {
        console.log("Saving editor state before unmounting...");
        const data = editor.saveToJSON();
        if (data) {
          console.log("this being called ");
          await api.post("room/canvas/save", {
            roomId,
            canvasData: data,
          });
        }
      };
      saveEditor();
    };
  }, [editor, roomId]);

  return (
    <div className={`h-screen w-screen overflow-hidden`}>
      <DGMEditor
        className="absolute inset-0"
        onMount={handleMount}
        onShapeInitialize={handleShapeInitialize}
        onActiveHandlerChange={(handler) => setActiveHandler(handler)}
        onSelectionChange={(selections) =>
          setHasSelection(selections.length > 0)
        }
        darkMode={isDarkMode}
        showGrid={true}
      />
      <Toolbar
        editor={editor}
        activeHandler={activeHandler}
        onActiveHandlerChange={(handler) =>
          window.editor.activateHandler(handler)
        }
        setShowPalette={setShowPalette}
      />
      {showPalette && (
        <Palette
          onPropsChange={handlePropsChange}
          currentPropsRef={currentPropsRef.current}
          isDarkMode={isDarkMode}
        />
      )}
      <HeaderActions
        setIsDarkMode={setIsDarkMode}
        isDarkMode={isDarkMode}
        editor={editor}
        isWsConnected={isWsConnected}
      />

      {/* ── Overlays ── */}
      {showConnectingOverlay && <ConnectingOverlay />}
      {!showConnectingOverlay && isCanvasLoading && (
        <ConnectingOverlay
          title="Loading Canvas"
          message="Fetching your drawings..."
        />
      )}
    </div>
  );
}

export default Canvas;
