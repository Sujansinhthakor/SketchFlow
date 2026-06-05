"use client";
import React, { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import {
  Pencil,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import SketchyCanvas from "./SketchCanvasBg";
import FeatureCard from "./FeatureCard";

import { ShinyBadge } from "./ShinyText";
import { useTheme } from "next-themes";
import BrandLogo from "../BrandLogo";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import useSession from "../../hooks/useSession";
import { useQueryClient } from "@tanstack/react-query";

// avatar palette
export const AVATAR_COLORS = [
  "#E06C75",
  "#D19A66",
  "#E5C07B",
  "#98C379",
  "#56B6C2",
  "#61AFEF",
  "#C678DD",
  "#BE5046",
  "#3E8FB0",
  "#9CCFD8",
  "#F6C177",
  "#EB6F92",
  "#8B5CF6",
  "#14B8A6",
];
const features = [
  {
    icon: <Pencil size={20} />,
    title: "Hand-drawn Feel",
    description:
      "Every shape has a natural, sketchy aesthetic — like drawing on paper but with infinite undo.",
  },
  {
    icon: <Users size={20} />,
    title: "Real-time Collaboration",
    description:
      "Work together in real time with WebSocket sync. See cursors, shapes, and edits as they happen.",
  },
  {
    icon: <Zap size={20} />,
    title: "Instant & Lightweight",
    description:
      "No sign-up, no loading screens. Open the canvas and start drawing in under a second.",
  },
  {
    icon: <Shield size={20} />,
    title: "Privacy First",
    description:
      "Your drawings stay yours. Self-hostable, open architecture, no analytics.",
  },
];

export function getUserColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ["session"] });
          setShowUserMenu(false);
          setIsSigningOut(false);
          router.replace("/");
        },
      },
    });
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0a0c]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Background sketchy canvas */}
      <SketchyCanvas />

      {/* ─── Navbar ─── */}
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 py-5">
        <BrandLogo />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>

          <a
            href="https://x.com/Sujanthakor94"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="X (formerly Twitter)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>X</title>
              <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
            </svg>
          </a>

          <a
            href="https://github.com/Sujansinhthakor/SketchFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="GitHub"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          {isLoading ? (
            <div className="h-8 w-24 rounded-xl bg-gray-200 animate-pulse dark:bg-white/10 hidden sm:block" />
          ) : session ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/8 cursor-pointer group"
              >
                <div
                  className="flex items-center justify-center h-7 w-7 rounded-full text-white text-[11px] font-semibold select-none ring-2 ring-white/20 dark:ring-white/10"
                  style={{
                    backgroundColor: getUserColor(session.user?.name ?? ""),
                  }}
                >
                  {session.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[96px] truncate">
                  {session.user?.name}
                </span>
              </button>

              {showUserMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />

                  {/* Dropdown panel */}
                  <div className="absolute right-0 top-full mt-2.5 -mx-10 z-50 w-52 rounded-2xl border shadow-2xl shadow-black/10 dark:shadow-black/40 bg-white border-gray-200/70 dark:bg-[#111113] dark:border-white/[0.07] overflow-hidden">
                    {/* User info header */}
                    <div className="px-3.5 pt-3.5 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center h-9 w-9 rounded-full text-white text-sm font-semibold select-none flex-shrink-0"
                          style={{
                            backgroundColor: getUserColor(
                              session.user?.name ?? "",
                            ),
                          }}
                        >
                          {session.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowUserMenu(false);
                        }}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                      >
                        {isSigningOut ? (
                          <>
                            <svg
                              className="animate-spin h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Signing out…
                          </>
                        ) : (
                          <>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Log in
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 md:pt-32 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-8 ">
          <ShinyBadge icon={"✨"}>Collaborative Whiteboard</ShinyBadge>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 transition-colors duration-500 text-gray-900 dark:text-white">
          Think.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Sketch.
          </span>
          <br />
          Collaborate.
        </h1>

        {/* Subheading */}
        <p className="max-w-md text-sm md:text-base leading-relaxed mb-10 transition-colors duration-500 text-gray-500">
          A minimal, open-source whiteboard for teams that think visually. No
          clutter just a canvas and your ideas.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <Link
            href={session ? "/dashboard" : "/canvas"}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {session ? "Go to Dashboard" : "Start Drawing"}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
          {!session && (
            <span className="text-[11px] text-gray-400 dark:text-gray-600">
              No sign-up required
            </span>
          )}
        </div>
      </section>

      {/* ─── Canvas preview mockup ─── */}
      <section className="relative z-10 flex justify-center px-6 pb-24">
        <div className="relative w-full max-w-3xl aspect-[16/10] rounded-2xl border overflow-hidden transition-all duration-500 bg-white/60 border-gray-200/60 shadow-[0_8px_48px_rgba(0,0,0,.08)] dark:bg-[#111113]/80 dark:border-white/[.06] dark:shadow-[0_8px_48px_rgba(0,0,0,.5)] backdrop-blur-xl">
          {/* Mock toolbar at top */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-white/[.06]">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 text-center text-[10px] font-medium text-gray-300 dark:text-gray-600">
              sketchpad / untitled
            </div>
          </div>

          {/* Mock canvas area with sketchy shapes */}
          <svg
            className="w-full h-full"
            viewBox="0 0 640 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid dots */}
            <pattern
              id="dots"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="16"
                cy="16"
                r="0.8"
                className="fill-black/5 dark:fill-white/5"
              />
            </pattern>
            <rect width="640" height="360" fill="url(#dots)" />

            {/* Sketchy rect */}
            <rect
              x="80"
              y="80"
              width="160"
              height="100"
              rx="4"
              className="stroke-blue-500/40 dark:stroke-blue-400/40 fill-blue-500/[.05] dark:fill-blue-400/[.05]"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Sketchy circle */}
            <circle
              cx="420"
              cy="140"
              r="55"
              className="stroke-violet-500/40 dark:stroke-violet-400/40 fill-violet-500/[.05] dark:fill-violet-400/[.05]"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Sketchy line */}
            <line
              x1="260"
              y1="130"
              x2="365"
              y2="130"
              className="stroke-red-500/35 dark:stroke-red-400/35"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* Arrow head */}
            <polyline
              points="355,124 367,130 355,136"
              className="stroke-red-500/35 dark:stroke-red-400/35"
              strokeWidth="2"
              fill="none"
            />

            {/* Sketchy diamond */}
            <polygon
              points="160,260 210,230 260,260 210,290"
              className="stroke-emerald-500/35 dark:stroke-emerald-400/35 fill-emerald-500/[.05] dark:fill-emerald-400/[.05]"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Text */}
            <text
              x="400"
              y="270"
              className="fill-black/15 dark:fill-white/20"
              fontSize="16"
              fontFamily="sans-serif"
              fontWeight="500"
            >
              hello world
            </text>

            {/* Cursor */}
            <g transform="translate(340, 190)">
              <polygon
                points="0,0 0,18 5,14 9,22 12,20 8,13 14,12"
                className="fill-blue-500/60 dark:fill-blue-400/60 stroke-blue-500/80 dark:stroke-blue-400/80"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
              delay={i * 100}
            />
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      {!session && (
        <section className="relative z-10 flex flex-col items-center text-center px-6 pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 transition-colors duration-500 text-gray-900 dark:text-white">
            Ready to sketch?
          </h2>
          <p className="text-sm mb-8 max-w-sm text-gray-500">
            Jump straight into the canvas. Your ideas are waiting.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Sign In
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-t transition-colors duration-500 border-gray-100 dark:border-white/[.05]">
        <span className="text-[11px] text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Sketchpad
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Sujansinhthakor/SketchFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
          >
            GitHub
          </a>
          <a
            href="https://x.com/Sujanthakor94"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
          >
            Twitter
          </a>
        </div>
      </footer>
    </div>
  );
}
