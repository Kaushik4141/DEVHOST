import Link from "next/link";

export const metadata = {
  title: "Contact | Lernflow",
};

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Contact</h1>
      <p style={{ marginTop: 8 }}>
        Reach us at <a href="mailto:support@lernflow.app">support@lernflow.app</a>.
      </p>
      <nav style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/about">About</Link>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Sign Up</Link>
      </nav>
    </main>
  );
}
