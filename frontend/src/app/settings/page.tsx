import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { getUserProfile, updateUserProfile } from "@/libs/api";

export const metadata = {
  title: "Settings | Lernflow",
};

export default function SettingsPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [username, setUsername] = React.useState<string>("");
  const [domain, setDomain] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    const token = await getToken();
    if (!token) return;
    const data = await getUserProfile(token);
    setProfile(data);
    setUsername(data?.username || "");
    setDomain(data?.domain || "");
  }, [isLoaded, isSignedIn, getToken]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      const updated = await updateUserProfile(token, { username, domain });
      setProfile(updated);
      setMsg("Saved");
    } catch (e: any) {
      setMsg(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Settings</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <SignedOut>
        <p>You are signed out.</p>
        <SignInButton mode="modal">
          <button style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6 }}>Sign in</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <section style={{ marginTop: 16 }}>
          <form onSubmit={onSave} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
            <label>
              <div>Username</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
              />
            </label>
            <label>
              <div>Domain</div>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
              />
            </label>
            <button disabled={saving} type="submit" style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6 }}>
              {saving ? "Saving..." : "Save"}
            </button>
            {msg && <p>{msg}</p>}
          </form>
          {profile && (
            <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8, overflowX: "auto", marginTop: 16 }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </section>
      </SignedIn>
    </main>
  );
}
