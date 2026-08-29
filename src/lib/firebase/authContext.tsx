"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { getUserProfile, saveUserProfile } from "./realtimeDb";
import { UserProfile } from "@/engine/schema";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  needsOnboarding: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (profileData: Omit<UserProfile, "userId" | "email" | "casesSolved" | "casesStarted" | "createdAt" | "updatedAt">) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  const fetchProfile = async (uid: string) => {
    try {
      const p = await getUserProfile(uid);
      if (p && p.lastName && p.firstName) {
        setProfile(p);
        setNeedsOnboarding(false);
      } else {
        setProfile(null);
        setNeedsOnboarding(true);
      }
    } catch (err) {
      console.warn("Error retrieving profile from Realtime Database:", err);
      setNeedsOnboarding(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !auth || !auth.name) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.uid);
        } else {
          setProfile(null);
          setNeedsOnboarding(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth listener warning:", e);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetchProfile(res.user.uid);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await fetchProfile(res.user.uid);
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        setNeedsOnboarding(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
  };

  const saveProfile = async (
    profileData: Omit<UserProfile, "userId" | "email" | "casesSolved" | "casesStarted" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...profileData,
      userId: user.uid,
      email: user.email || "",
      photoURL: user.photoURL || undefined,
      detectiveId: profile?.detectiveId || `DET-${Math.floor(1000 + Math.random() * 9000)}`,
      casesSolved: profile?.casesSolved || 0,
      casesStarted: profile?.casesStarted || 0,
      createdAt: profile?.createdAt || now,
      updatedAt: now,
    };

    await saveUserProfile(user.uid, newProfile);
    setProfile(newProfile);
    setNeedsOnboarding(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        needsOnboarding,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        saveProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
