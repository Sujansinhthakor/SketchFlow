import { Editor } from "@dgmjs/core";
import { Download, House, Moon, Share2, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomModal from "./RoomModal";
import { exportImageAsFile } from "@dgmjs/export";

interface HeaderActionsProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  editor: Editor | null;
  isWsConnected?: boolean;
}

const HeaderActions = (props: HeaderActionsProps) => {
  const [scale, setScale] = useState(100);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const router = useRouter();

  const changeTheme = () => {
    props.setIsDarkMode(!props.isDarkMode);
  };

  useEffect(() => {
    if (!props.editor) return;
    const handleScaleChange = () => {
      const percent = props.editor!.getScale() * 100;
      setScale(Math.round(percent));
    };
    handleScaleChange();
    props.editor.onRepaint.addListener(handleScaleChange);
    return () => {
      props.editor?.onRepaint.removeListener(handleScaleChange);
    };
  }, [props.editor]);

  const handleCreateRoom = (roomId: string) => {
    router.replace(`/canvas/${roomId}?mode=Multiplayer`, { scroll: false });
  };

  const buttonBase =
    "flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ease-out text-gray-500 hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200 dark:focus-visible:ring-white/30";

  const handleDownload = async () => {
    if (!props.editor) return;

    const canvas = props.editor.canvas;
    const page = props.editor.getCurrentPage();
    if (!page) return;

    const currentScale = props.editor.getScale();

    await exportImageAsFile(canvas, page, [], "sketchflow-canvas", {
      scale: currentScale,
      dark: props.isDarkMode,
      fillBackground: true,
      format: "image/png",
      margin: 10,
    });
  };

  return (
    <>
      <div
        className="absolute right-4 top-4 flex items-center gap-1 rounded-2xl px-2 py-1.5
          bg-white/80 border border-gray-200/70 shadow-md
          dark:bg-[#1e1e22]/80 dark:border-white/[.08] dark:shadow-[0_4px_24px_rgba(0,0,0,.4)]
          backdrop-blur-xl transition-colors duration-300"
      >
        {/* ── 1. View: Scale indicator ── */}
        <span className="min-w-[3rem] text-center text-xs font-medium tabular-nums select-none text-gray-500 dark:text-gray-400">
          {scale}%
        </span>

        {/* ── Separator ── */}
        <div className="mx-0.5 flex items-center">
          <div className="h-5 w-px bg-gray-200 dark:bg-white/[.08]" />
        </div>

        {/* ── 2. Document Actions: Download & Share ── */}
        <button
          title="Download"
          onClick={handleDownload} /* Make sure to define this function */
          aria-label="Download"
          className={buttonBase}
        >
          <Download size={18} />
        </button>

        <button
          onClick={() => setIsRoomModalOpen(true)}
          aria-label="Share"
          className={buttonBase}
        >
          <Share2 size={18} />
        </button>

        {/* ── Separator ── */}
        <div className="mx-0.5 flex items-center">
          <div className="h-5 w-px bg-gray-200 dark:bg-white/[.08]" />
        </div>

        {/* ── 3. Global/System: Theme & User ── */}
        <button
          onClick={changeTheme}
          aria-label="Toggle theme"
          className={buttonBase}
        >
          {props.isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          onClick={() => router.replace("/dashboard")}
          title="Dashboard"
          aria-label="User profile"
          className={buttonBase}
        >
          <House size={18} />
        </button>
      </div>

      {/* ── Room Modal ── */}
      <RoomModal
        editor={props.editor}
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
        isWsConnected={props.isWsConnected}
      />
    </>
  );
};

export default HeaderActions;
