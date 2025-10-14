import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Structures & Algorithms | Lernflow',
  description: 'Learn and practice data structures and algorithms with interactive visualizations',
};

export default function DSALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-white">
      <div className="py-8">
        {children}
      </div>
    </section>
  );
}