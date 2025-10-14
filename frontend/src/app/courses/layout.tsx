import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | Lernflow',
  description: 'Browse our collection of courses',
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  // This is a server component by default. Pages under /courses can be client components.
  return <>{children}</>;
}
