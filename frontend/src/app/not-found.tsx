import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Page not found</h1>
      <p style={{ marginTop: 8 }}>The page you are looking for does not exist.</p>
      <nav style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </main>
  );
}
