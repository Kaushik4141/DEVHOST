# Frontend auth setup (Clerk + Next.js)

1. Install dependencies:

   ```bash
   npm i @clerk/nextjs
   ```

2. Create `.env.local` in `frontend1/` with:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```

3. Backend CORS (in Backend/.env):

   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start servers:

   - Backend: `npm run dev` in `Backend/`
   - Frontend: `npm run dev` in `frontend1/` and open http://localhost:3000

5. Try it out:

   - Visit `/sign-in` to log in.
   - Visit `/profile` to fetch your profile via backend `/auth/me`.
