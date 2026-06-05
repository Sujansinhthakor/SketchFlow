import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../api";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
}: CreateRoomModalProps) {
  const [workspaceNameInput, setWorkspaceNameInput] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const createWorkspaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post("/room/add", {
        name,
      });
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWorkspaces"] });
      toast.success("Workspace created successfully!", {
        position: "bottom-right",
      });
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage, { position: "bottom-right" });
    },
  });

  const isCreating = createWorkspaceMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setWorkspaceNameInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCreating) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, isCreating]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (workspaceNameInput.trim()) {
      createWorkspaceMutation.mutate(workspaceNameInput.trim());
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current && !isCreating) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
    >
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden border bg-white dark:bg-[#18181b] border-gray-200/80 dark:border-white/[.08] shadow-2xl dark:shadow-[0_8px_48px_rgba(0,0,0,.5)] animate-[slideUp_200ms_ease-out]">
        <button
          onClick={onClose}
          disabled={isCreating}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create Workspace
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter a name for your new workspace.
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              Workspace Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. My Awesome Project"
                value={workspaceNameInput}
                onChange={(e) => setWorkspaceNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) handleCreate();
                }}
                disabled={isCreating}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none bg-white border-gray-200 text-gray-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:bg-[#111113] dark:border-white/10 dark:text-white dark:focus:border-blue-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!workspaceNameInput.trim() || isCreating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer bg-neutral-700 text-white hover:bg-zinc-800 active:scale-[.98] disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
