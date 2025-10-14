import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | Lernflow',
  description: 'Component and developer documentation',
};

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  // Route-level layouts should NOT render <html> or <body> — the root layout owns those.
  return <>{children}</>;
}
