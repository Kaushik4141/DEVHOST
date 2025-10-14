"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <SignedOut>
        <p style={{ marginTop: 12 }}>You must sign in to access the dashboard.</p>
        <SignInButton mode="modal">
          <button style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6 }}>Sign in</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <section style={{ marginTop: 16 }}>
          <p>Welcome to your dashboard. Navigate to <Link href="/profile">Profile</Link> to test backend integration.</p>
        </section>
      </SignedIn>
    </main>
  );
}
