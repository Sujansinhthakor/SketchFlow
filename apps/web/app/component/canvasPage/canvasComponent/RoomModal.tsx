"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Hash, Copy, Check, X, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { Editor } from "@dgmjs/core";
import api from "../../../../api";

interface RoomModalProps {
  editor?: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomId: string) => void;
  isWsConnected?: boolean;
}

export default function RoomModal({
  isOpen,
  onClose,
  onCreateRoom,
  isWsConnected,
}: RoomModalProps) {
  const params = useParams();
  const currentRoomId = params.roomId as string;

  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setIsCreating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isCreating && isWsConnected) {
      setIsCreating(false);
      onClose();
    }
  }, [isWsConnected, isCreating, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentRoomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 400));
    onCreateRoom(currentRoomId);
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
    >
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden border bg-white dark:bg-[#18181b] border-gray-200/80 dark:border-white/[.08] shadow-2xl dark:shadow-[0_8px_48px_rgba(0,0,0,.5)] animate-[slideUp_200ms_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Live Collaboration
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enable live multiplayer for this canvas and share the room ID.
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              Room ID
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Hash
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  type="text"
                  value={currentRoomId || ""}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-mono border outline-none select-all bg-gray-50 border-gray-200 text-gray-700 dark:bg-white/[.04] dark:border-white/10 dark:text-gray-300"
                />
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-200 cursor-pointer text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Copy Room ID"
              >
                {copied ? (
                  <Check size={15} className="text-emerald-500" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl px-4 py-3 text-xs leading-relaxed bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <strong>Tip:</strong> Share this Room ID with teammates or just copy
            the URL after you go live to jump right in.
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer bg-neutral-700 text-white hover:bg-zinc-800 active:scale-[.98] disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Users size={16} />
                Invite & Go Live
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
}

export function JoinRoomModal({
  isOpen,
  onClose,
  onJoinRoom,
}: JoinRoomModalProps) {
  const [roomIdInput, setRoomIdInput] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRoomIdInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (roomIdInput.trim()) {
      const a = await api.post("/room/join", {
        slug: roomIdInput.trim(),
      });
      onJoinRoom(roomIdInput.trim());
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
    >
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden border bg-white dark:bg-[#18181b] border-gray-200/80 dark:border-white/[.08] shadow-2xl dark:shadow-[0_8px_48px_rgba(0,0,0,.5)] animate-[slideUp_200ms_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Join Workspace
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the Room ID to collaborate in real-time.
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              Room ID
            </label>
            <div className="relative">
              <Hash
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="e.g. vt7m5rMiUB"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoin();
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-mono border outline-none bg-white border-gray-200 text-gray-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:bg-[#111113] dark:border-white/10 dark:text-white dark:focus:border-blue-500/50"
              />
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!roomIdInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer bg-neutral-700 text-white hover:bg-zinc-800 active:scale-[.98] disabled:opacity-50"
          >
            <Users size={16} />
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
