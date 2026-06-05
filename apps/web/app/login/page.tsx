"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import api from "../../api";
import BrandLogo from "../component/BrandLogo";
import { authClient } from "../lib/auth-client";
import toast from "react-hot-toast";

const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/signin", { email, password });
  return response.data;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email(
      {
        email,
        password,
        rememberMe: true,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ["session"] });
          router.replace("/dashboard");
          toast.success("Welcome back!");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message, { position: "bottom-right" });
        },
      },
    );
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0a0c]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl bg-white/80 border-gray-200/60 shadow-gray-200/50 dark:bg-[#111113]/80 dark:border-white/[.08] dark:shadow-black/50">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to access your workspaces.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500/50 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500/50 dark:focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500/50 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500/50 dark:focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold hover:underline text-gray-900 dark:text-white"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
