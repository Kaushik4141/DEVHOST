import { clerkMiddleware } from '@clerk/nextjs/server';

// Protect only the dashboard and settings routes; rest remain public.
export default clerkMiddleware();

export const config = {
  matcher: [
    '/dashboard(.*)',
    '/settings(.*)'
  ],
};
