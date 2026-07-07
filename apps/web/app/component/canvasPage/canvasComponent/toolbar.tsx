import type { Editor } from "@dgmjs/core";
import { useState } from "react";
import {
  CircleIcon,
  Eraser,
  Frame,
  HandIcon,
  HighlighterIcon,
  ImageIcon,
  MousePointer2Icon,
  PencilIcon,
  SlashIcon,
  SplineIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react";

/* ───────────────────── types ───────────────────── */

interface ToolItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  active: boolean;
  tooltip: string;
}

interface ToolbarProps {
  activeHandler?: string;
  onActiveHandlerChange?: (handler: string) => void;
  editor: Editor | null;
  setShowPalette: React.Dispatch<React.SetStateAction<boolean>>;
}

/* ───────────────────── ToolItem ───────────────────── */

function ToolItem({
  active = false,
  tooltip,
  children,
  ...props
}: ToolItemProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <button
        aria-label={tooltip}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-gray-300 dark:focus-visible:ring-white/30
          text-gray-500 hover:bg-gray-50 hover:text-gray-800
          dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200
          ${
            active
              ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
              : ""
          }`}
        {...props}
      >
        {children}
      </button>

      {/* tooltip */}
      <span
        className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100
        bg-black text-white dark:bg-gray-200 dark:text-gray-900"
      >
        {tooltip}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="mx-0.5 flex items-center">
      <div className="h-5 w-px bg-gray-200 dark:bg-white/[.08]" />
    </div>
  );
}

/* ───────────────────── Toolbar ───────────────────── */

type ToolGroup = {
  tools: { id: string; icon: React.ReactNode; label: string }[];
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    tools: [
      {
        id: "Select",
        icon: <MousePointer2Icon className="h-[18px] w-[18px]" />,
        label: "Select (V)",
      },
      {
        id: "Hand",
        icon: <HandIcon className="h-[18px] w-[18px]" />,
        label: "Hand (H)",
      },
      {
        id: "Eraser",
        icon: <Eraser className="h-[18px] w-[18px]" />,
        label: "Eraser (E)",
      },
    ],
  },
  {
    tools: [
      {
        id: "Rectangle",
        icon: <SquareIcon className="h-[18px] w-[18px]" />,
        label: "Rectangle (R)",
      },
      {
        id: "Ellipse",
        icon: <CircleIcon className="h-[18px] w-[18px]" />,
        label: "Ellipse (O)",
      },
      {
        id: "Text",
        icon: <TypeIcon className="h-[18px] w-[18px]" />,
        label: "Text (T)",
      },
      {
        id: "Image",
        icon: <ImageIcon className="h-[18px] w-[18px]" />,
        label: "Image",
      },
    ],
  },
  {
    tools: [
      {
        id: "Line",
        icon: <SlashIcon className="h-[18px] w-[18px]" />,
        label: "Line (L)",
      },
      {
        id: "Connector",
        icon: <SplineIcon className="h-[18px] w-[18px]" />,
        label: "Connector",
      },
      {
        id: "Freehand",
        icon: <PencilIcon className="h-[18px] w-[18px]" />,
        label: "Freehand (P)",
      },
      {
        id: "Highlighter",
        icon: <HighlighterIcon className="h-[18px] w-[18px]" />,
        label: "Highlighter",
      },
    ],
  },
  {
    tools: [
      {
        id: "Frame",
        icon: <Frame className="h-[18px] w-[18px]" />,
        label: "Diamond (D)",
      },
    ],
  },
];

export function Toolbar({
  activeHandler = "Select",
  onActiveHandlerChange,
  editor,
  setShowPalette,
}: ToolbarProps) {
  const [hovered, setHovered] = useState(false);

  const setActiveHandler = (handler: string) => {
    if (onActiveHandlerChange) onActiveHandlerChange(handler);
    if (
      handler !== "Highlighter" ||
      "Eraser" ||
      "Select" ||
      "Hand" ||
      "Image"
    ) {
      setShowPalette(true);
    } else {
      setShowPalette(false);
    }
  };

  return (
    <div className="pointer-events-none absolute top-5 flex w-full items-center justify-center">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`pointer-events-auto flex items-center gap-0.5 rounded-2xl px-2 py-1.5 backdrop-blur-xl transition-all duration-300 ease-out
          bg-white/80 border border-gray-200/70 shadow-md
          dark:bg-[#1e1e22]/80 dark:border-white/[.08] dark:shadow-[0_4px_24px_rgba(0,0,0,.4)]
          ${hovered ? "scale-[1.02]" : "scale-100"}`}
      >
        {TOOL_GROUPS.map((group, gi) => (
          <div key={gi} className="contents">
            {gi > 0 && <Separator />}
            {group.tools.map((tool) => (
              <ToolItem
                key={tool.id}
                tooltip={tool.label}
                active={activeHandler === tool.id}
                onClick={() => setActiveHandler(tool.id)}
              >
                {tool.icon}
              </ToolItem>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
