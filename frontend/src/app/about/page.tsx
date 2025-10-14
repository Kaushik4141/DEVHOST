import Link from "next/link";

export const metadata = {
  title: "About | Lernflow",
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>About Lernflow</h1>
      <p style={{ marginTop: 8 }}>
        Lernflow helps you build and ship faster with a clean developer experience.
      </p>
      <nav style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/">Home</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/sign-in">Sign In</Link>
      </nav>
    </main>
  );
}
