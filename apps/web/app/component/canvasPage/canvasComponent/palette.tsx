import type { ShapeProps } from "@dgmjs/core";
import { useState } from "react";

/* ───────────────────── data ───────────────────── */

const SIZES = [
  { label: "S", fontSize: 16, strokeWidth: 1 },
  { label: "M", fontSize: 20, strokeWidth: 2 },
  { label: "L", fontSize: 28, strokeWidth: 3 },
  { label: "XL", fontSize: 40, strokeWidth: 4 },
];

/* ───────────────────── types ───────────────────── */

interface PaletteProps {
  onPropsChange?: (props: ShapeProps) => void;
  isDarkMode: boolean;
  currentPropsRef: ShapeProps;
}

/* ───────────────────── component ───────────────────── */

export function Palette({
  onPropsChange,
  isDarkMode,
  currentPropsRef,
}: PaletteProps) {
  const isDark = isDarkMode;

  const strokeColor = [
    {
      label: "Red",
      stroke: "$red9",
      swatch: "#f87171",
    },
    {
      label: "Blue",
      stroke: "$blue9",
      swatch: "#60a5fa",
    },
    {
      label: "Green",
      stroke: "$green9",
      swatch: "#4ade80",
    },
    {
      label: "Gray",
      stroke: "$gray9",
      swatch: "#9ca3af",
    },
    {
      label: "Default",
      stroke: isDark ? "#ffffff" : "#000000",
      swatch: isDark ? "#ffffff" : "#000000",
    },
  ];

  const StrokeFillColor = [
    {
      label: "Red",
      fill: "$red4",
      swatch: "#f87171",
    },
    {
      label: "Blue",
      fill: "$blue4",
      swatch: "#60a5fa",
    },
    {
      label: "Green",
      fill: "$green4",
      swatch: "#4ade80",
    },
    {
      label: "Gray",
      fill: "$gray3",
      swatch: "#9ca3af",
    },
    {
      label: "Default",
      fill: isDark ? "#ffffff" : "#000000",
      swatch: isDark ? "#ffffff" : "#000000",
    },
  ];
  const [activeStrokeColor, setActiveStrokeColor] = useState(
    strokeColor.findIndex((c) => c.stroke === currentPropsRef.strokeColor) || 1,
  );
  const [activeFillColor, setActiveFillColor] = useState(
    StrokeFillColor.findIndex((c) => c.fill === currentPropsRef.fillColor) || 1,
  );
  const [activeSize, setActiveSize] = useState(
    SIZES.findIndex((s) => s.fontSize === currentPropsRef.fontSize) || 1,
  );

  const apply = (strokeIdx: number, fillIdx: number, sizeIdx: number) => {
    const color = strokeColor[strokeIdx];
    const strokeFillColor = StrokeFillColor[fillIdx];
    const size = SIZES[sizeIdx];

    if (!color || !strokeFillColor || !size) return;

    onPropsChange?.({
      fillColor: strokeFillColor.fill,
      strokeColor: color.stroke,
      fontSize: size.fontSize,
      strokeWidth: size.strokeWidth,
    });
  };

  const pickStrokeColor = (i: number) => {
    setActiveStrokeColor(i);
    apply(i, activeFillColor, activeSize);
  };

  const pickFillColor = (i: number) => {
    setActiveFillColor(i);
    apply(activeStrokeColor, i, activeSize);
  };

  const pickSize = (i: number) => {
    setActiveSize(i);
    apply(activeStrokeColor, activeFillColor, i);
  };

  /* ── shared style helpers ── */
  const swatchRing = (isActive: boolean) =>
    isActive
      ? "ring-2 ring-gray-800 ring-offset-2 ring-offset-white dark:ring-white/70 dark:ring-offset-[#1e1e22]"
      : "ring-0 hover:ring-1 hover:ring-gray-300 hover:ring-offset-1 ring-offset-white dark:hover:ring-white/30 dark:ring-offset-[#1e1e22]";

  return (
    <div
      className="absolute left-4 top-4 w-48 overflow-hidden rounded-2xl backdrop-blur-xl transition-colors duration-300
        bg-white/80 border border-gray-200/70 shadow-md
        dark:bg-[#1e1e22]/80 dark:border-white/[.08] dark:shadow-[0_4px_24px_rgba(0,0,0,.4)]"
    >
      {/* ── Stroke Color section ── */}
      <div className="border-b border-gray-100 dark:border-white/[.08] px-3.5 py-3">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Stroke Color
        </p>
        <div className="flex gap-2">
          {strokeColor.map((c, i) => (
            <button
              key={c.label}
              aria-label={c.label}
              onClick={() => pickStrokeColor(i)}
              className={`h-6 w-6 cursor-pointer rounded-full transition-all duration-200 hover:scale-110 ${swatchRing(
                activeStrokeColor === i,
              )}`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
      </div>

      {/* ── Fill Color section ── */}
      <div className="border-b border-gray-100 dark:border-white/[.08] px-3.5 py-3">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Fill Color
        </p>
        <div className="flex gap-2">
          {StrokeFillColor.map((c, i) => (
            <button
              key={c.label}
              aria-label={c.label}
              onClick={() => pickFillColor(i)}
              className={`h-6 w-6 cursor-pointer rounded-full transition-all duration-200 hover:scale-110 ${swatchRing(
                activeFillColor === i,
              )}`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
      </div>

      {/* ── Size section ── */}
      <div className="border-b border-gray-100 dark:border-white/[.08] px-3.5 py-3">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Size
        </p>
        <div className="flex gap-1">
          {SIZES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => pickSize(i)}
              className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-all duration-200
                text-gray-500 hover:bg-gray-50 hover:text-gray-800
                dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200
                ${
                  activeSize === i
                    ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
                    : ""
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
