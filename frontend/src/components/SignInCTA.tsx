"use client";
import { useRouter } from "next/navigation";

export default function SignInCTA() {
  const router = useRouter();
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <button
        onClick={() => router.push("/sign-in")}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sign in
      </button>
    </div>
  );
}
