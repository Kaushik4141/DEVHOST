"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { getAuthMe } from "@/libs/api";

function AuthSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const FLAG = "lf_user_synced";
    if (typeof window !== "undefined" && sessionStorage.getItem(FLAG) === "1") return;
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          await getAuthMe(token); // Ensures user is upserted in DB via /auth/me
          if (typeof window !== "undefined") sessionStorage.setItem(FLAG, "1");
        }
      } catch {
        // ignore; backend may be offline or keys missing
      }
    })();
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AuthSync />
      {children}
    </ClerkProvider>
  );
}
