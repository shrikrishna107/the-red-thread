"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { X, ShieldAlert, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, loading } = useAuth();
  const [tab, setTab] = useState<"LOGIN" | "SIGNIN">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      if (tab === "LOGIN") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message?.replace("Firebase:", "").trim() || "Authentication failed. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      setErrorMsg(err.message?.replace("Firebase:", "").trim() || "Google sign-in was interrupted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-noir-900 border border-noir-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Top Header */}
        <div className="p-4 bg-noir-950 border-b border-noir-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-thread-950 border border-thread-700 flex items-center justify-center font-serif font-bold text-thread-400 text-sm">
              Ψ
            </div>
            <span className="font-serif font-bold text-sm tracking-widest text-noir-100 uppercase">
              TELLTALE ACCESS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-noir-400 hover:text-noir-100 hover:bg-noir-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tabs: LOG IN vs SIGN IN */}
          <div className="grid grid-cols-2 gap-1 bg-noir-950 p-1 rounded-lg border border-noir-800">
            <button
              onClick={() => { setTab("LOGIN"); setErrorMsg(""); }}
              className={`py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all ${
                tab === "LOGIN"
                  ? "bg-noir-850 text-thread-300 border border-thread-700/80 shadow"
                  : "text-noir-400 hover:text-noir-200"
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => { setTab("SIGNIN"); setErrorMsg(""); }}
              className={`py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all ${
                tab === "SIGNIN"
                  ? "bg-noir-850 text-thread-300 border border-thread-700/80 shadow"
                  : "text-noir-400 hover:text-noir-200"
              }`}
            >
              SIGN IN
            </button>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting || loading}
            className="w-full py-2.5 px-4 rounded-lg bg-noir-850 border border-noir-700 hover:border-noir-600 hover:bg-noir-800 text-noir-100 text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-noir-800" />
            <span className="text-[10px] font-mono text-noir-500 uppercase">or with email</span>
            <div className="flex-1 h-px bg-noir-800" />
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-2.5 rounded bg-thread-950/80 border border-thread-800 text-xs font-sans text-thread-300 flex items-start gap-2">
              <ShieldAlert size={14} className="text-thread-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="detective@telltale.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 placeholder-noir-600 outline-none font-sans"
                />
                <Mail size={14} className="absolute left-3 top-2.5 text-noir-500" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-400 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 placeholder-noir-600 outline-none font-sans"
                />
                <Lock size={14} className="absolute left-3 top-2.5 text-noir-500" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-thread-900 via-thread-800 to-thread-900 border border-thread-600 text-thread-100 hover:from-thread-800 hover:to-thread-700 font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-noir-glow transition-all disabled:opacity-50"
              >
                <span>{tab === "LOGIN" ? "LOG IN AS DETECTIVE" : "SIGN IN / CREATE ACCOUNT"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
