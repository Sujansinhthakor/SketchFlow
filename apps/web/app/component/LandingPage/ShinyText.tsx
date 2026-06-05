"use client";

import React from "react";

const SHINY_CSS = `
  @property --shiny-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes shiny-border-spin {
    to { --shiny-angle: 360deg; }
  }

  @keyframes shiny-text-sweep {
    0%   { background-position: 150% center; }
    100% { background-position: -50% center; }
  }

  /* ── Light variant (default) ── */
  .shiny-outer {
    display: inline-flex;
    border-radius: 9999px;
    padding: 1.5px;
    background: conic-gradient(
      from var(--shiny-angle),
      rgba(0,0,0,0.10)       0deg,
      rgba(0,0,0,0.10)       95deg,
      rgba(99,102,241,0.50)  112deg,
      rgba(99,102,241,1.00)  120deg,
      rgba(139,92,246,0.90)  128deg,
      rgba(99,102,241,0.35)  140deg,
      rgba(0,0,0,0.10)       158deg,
      rgba(0,0,0,0.10)       360deg
    );
    animation: shiny-border-spin 8s linear infinite;
  }
  
  /* ── Dark variant ── */
  .dark .shiny-outer {
    background: conic-gradient(
      from var(--shiny-angle),
      rgba(255,255,255,0.09) 0deg,
      rgba(255,255,255,0.09) 95deg,
      rgba(255,255,255,0.55) 112deg,
      rgba(255,255,255,1.00) 120deg,
      rgba(210,220,255,0.80) 128deg,
      rgba(255,255,255,0.40) 140deg,
      rgba(255,255,255,0.09) 158deg,
      rgba(255,255,255,0.09) 360deg
    );
  }

  /* Inner pill */
  .shiny-inner {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    user-select: none;
  }

  /* Text shimmer */
  .shiny-text {
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shiny-text-sweep 4s ease-in-out infinite;
    background-image: linear-gradient(
      90deg,
      rgba(30,27,75,0.55)    0%,
      rgba(30,27,75,0.55)    30%,
      rgba(99,102,241,1.00)  50%,
      rgba(30,27,75,0.55)    70%,
      rgba(30,27,75,0.55)    100%
    );
  }

  .dark .shiny-text {
    background-image: linear-gradient(
      90deg,
      rgba(255,255,255,0.45) 0%,
      rgba(255,255,255,0.45) 30%,
      rgba(255,255,255,1.00) 50%,
      rgba(255,255,255,0.45) 70%,
      rgba(255,255,255,0.45) 100%
    );
  }
`;

interface ShinyBadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ShinyBadge({
  icon,
  children,
  className = "",
}: ShinyBadgeProps) {
  return (
    <>
      <style>{SHINY_CSS}</style>

      <div className={`shiny-outer ${className}`}>
        <div className="shiny-inner bg-[#fafafa] dark:bg-[#0a0a0c] text-gray-500 dark:text-gray-400">
          {icon && <span aria-hidden="true" className="flex-shrink-0">{icon}</span>}
          <span className="shiny-text">
            {children}
          </span>
        </div>
      </div>
    </>
  );
}
