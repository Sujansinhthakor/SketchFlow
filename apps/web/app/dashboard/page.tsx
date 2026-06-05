"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderOpen,
  Clock,
  Search,
  Sun,
  Moon,
  Users,
  Loader2,
  UserPlus,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import BrandLogo from "../component/BrandLogo";
import useSession from "../hooks/useSession";
import { getUserColor } from "../component/LandingPage/LandingPage";
import api from "../../api";
import toast from "react-hot-toast";
import { JoinRoomModal } from "../component/canvasPage/canvasComponent/RoomModal";
import CreateRoomModal from "../component/DashboardPage/workspaceModal";
import WorkspacesSkeleton from "../component/Skeleton/dashboardSkeleton";

const SharedBadge = () => (
  <span
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium
    bg-violet-50 text-violet-500
    dark:bg-violet-500/10 dark:text-violet-400
    border border-violet-100 dark:border-violet-500/20
    select-none"
  >
    <Users size={9} strokeWidth={2.5} />
    Shared
  </span>
);

const formatDate = (dateString?: string) => {
  if (!dateString) return "Just now";
  if (!dateString.includes("T") && isNaN(Date.parse(dateString))) {
    return dateString;
  }
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const DashboardPage = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session, isLoading: isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) router.replace("/login");
  }, [session, isSessionLoading, router]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["allWorkspaces"],
    queryFn: async () => {
      const res = await api.get("/room/get");
      return res.data.data || res.data; // Handles different response wrappings
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const res = await api.delete("/room/delete", {
        data: { roomId },
      });
      return res.data.data || res.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["allWorkspaces"] });
      const actionMessage =
        data?.action === "left"
          ? "Successfully left the shared workspace!"
          : "Workspace deleted successfully!";
      toast.success(actionMessage, {
        position: "bottom-right",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete workspace";
      toast.error(errorMessage, { position: "bottom-right" });
    },
  });

  const handleDeleteWorkspace = (id: string) => {
    deleteWorkspaceMutation.mutate(id);
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

  const filteredWorkspaces = workspaces.filter((w: any) => {
    const name = w.name || w.slug || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className="min-h-screen transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0a0c]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ─── Navbar ─── */}
      <nav
        className={`sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b transition-colors
          bg-[#fafafa]/80 border-gray-200/80
          dark:bg-[#0a0a0c]/80 dark:border-white/[.06]
          ${showUserMenu ? "" : "backdrop-blur-xl"}`}
      >
        <BrandLogo />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors text-gray-500
              hover:bg-gray-100 hover:text-gray-900
              dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />

          {isSessionLoading ? (
            <div className="h-8 w-24 rounded-xl bg-gray-200 animate-pulse dark:bg-white/10 hidden sm:block" />
          ) : session ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200
                  hover:bg-gray-100 dark:hover:bg-white/8 cursor-pointer group"
              >
                <div
                  className="flex items-center justify-center h-7 w-7 rounded-full text-white text-[11px] font-semibold
                    select-none ring-2 ring-white/20 dark:ring-white/10"
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
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />

                  <div
                    className="absolute right-0 top-full mt-4 -mx-4 z-50 w-52 rounded-2xl border shadow-2xl
                    shadow-black/10 dark:shadow-black/40
                    bg-white border-gray-200/70
                    dark:bg-[#111113] dark:border-white/[0.07]
                    overflow-hidden"
                  >
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

                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowUserMenu(false);
                        }}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors
                          text-red-500 hover:bg-red-50 hover:text-red-600
                          dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300
                          disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
          ) : null}
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
              Your Workspaces
            </h1>
            <p className="text-sm text-gray-500">
              Jump back into your recent drawings or start a new one.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setisCreateModalOpen(true)}
              disabled={isWorkspacesLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 shadow-sm
              bg-gray-900 text-white hover:bg-gray-800
              dark:bg-white dark:text-black dark:hover:bg-gray-200
              disabled:opacity-50"
            >
              <div className="flex gap-2 items-center">
                <Plus size={16} /> New Workspace
              </div>
            </button>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 shadow-sm
              bg-gray-900 text-white hover:bg-gray-800
              dark:bg-white dark:text-black dark:hover:bg-gray-200
              disabled:opacity-50"
            >
              <div className="flex gap-2 items-center">
                <UserPlus size={16} /> Join Workspace
              </div>
            </button>
          </div>
        </div>

        {/* ─── Search ─── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border outline-none transition-colors
                bg-white border-gray-200 text-gray-900 placeholder-gray-400
                focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10
                dark:bg-[#111113] dark:border-white/10 dark:text-white dark:placeholder-gray-500
                dark:focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* ─── Workspace Grid ─── */}
        {isWorkspacesLoading ? (
          <WorkspacesSkeleton />
        ) : filteredWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkspaces.map((workspace: any) => {
              const isDeleting =
                deleteWorkspaceMutation.isPending &&
                deleteWorkspaceMutation.variables === workspace.id;
              return (
                <Link
                  key={workspace.id}
                  href={`/canvas/${workspace.slug}?${workspace.isShared ? "mode=Multiplayer" : "mode=solo"}`}
                  onMouseLeave={() => setConfirmDeleteId(null)}
                  className={`group relative flex flex-col p-5 rounded-2xl border transition-all duration-300
              bg-white border-gray-200 hover:shadow-lg hover:border-gray-300
              dark:bg-[#111113]/50 dark:border-white/6 dark:hover:bg-white/5 dark:hover:border-white/12
              ${isDeleting ? "pointer-events-none opacity-60" : ""}`}
                >
                  {/* ── Card header: folder icon ── */}
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors
                  bg-gray-100 text-gray-600 group-hover:bg-gray-200
                  dark:bg-white/[.04] dark:text-gray-400 dark:group-hover:bg-white/[.08]"
                    >
                      <FolderOpen size={20} />
                    </div>
                    {workspace.isShared && <SharedBadge />}
                  </div>

                  {/* ── Card footer: name + meta row ── */}
                  <div>
                    <h3 className="font-semibold mb-2 truncate text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
                      {workspace.name}
                    </h3>

                    {/* Metadata row — timestamp left, actions right */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                        <Clock size={12} className="flex-shrink-0" />
                        <span className="truncate">
                          Edited{" "}
                          {formatDate(workspace.updated || workspace.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isDeleting ? (
                          <div className="p-2 text-red-500 dark:text-red-400">
                            <Loader2 size={13} className="animate-spin" />
                          </div>
                        ) : confirmDeleteId === workspace.id ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                              handleDeleteWorkspace(workspace.id);
                            }}
                            aria-label="Confirm delete"
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold
                        transition-all duration-150 cursor-pointer
                        text-gray-400 hover:text-red-500 hover:bg-red-50
                        dark:text-gray-600 dark:hover:text-red-400 dark:hover:bg-red-500/10"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDeleteId(workspace.id);
                            }}
                            aria-label="Delete workspace"
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-md transition-all duration-150 cursor-pointer
                        text-gray-400 hover:text-red-500 hover:bg-red-50
                        dark:text-gray-600 dark:hover:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed
      border-gray-200 bg-gray-50
      dark:border-white/10 dark:bg-white/[.02]"
          >
            <div
              className="h-12 w-12 rounded-full mb-4 flex items-center justify-center
        bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500"
            >
              <FolderOpen size={24} />
            </div>
            <p className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-300">
              No workspaces found
            </p>
            <p className="text-xs text-gray-500">
              {searchQuery
                ? "Try a different search term."
                : "Create your first workspace to get started."}
            </p>
          </div>
        )}
      </main>

      {/* ─── Join Room Modal ─── */}
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinRoom={(roomId) => {
          router.push(`/canvas/${roomId}?mode=Multiplayer`);
        }}
      />

      {/* ─── Create Room Modal ─── */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setisCreateModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
