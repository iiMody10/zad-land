# Phase 3: Next.js and Laravel/MySQL connection

Next.js keeps its current routes and UI. Browser API calls under `/api/*`, the Sanctum CSRF endpoint, and uploaded files are proxied to Laravel by `next.config.ts`. Server components and server actions use `lib/laravel-server.ts`; browser mutations use `lib/laravel-client.ts` so the Sanctum CSRF token is attached.

## Local startup

1. Configure `backend/.env` for the local MySQL database, then run `cd backend && php artisan migrate --seed`.
2. Set `LARAVEL_API_URL=http://127.0.0.1:8000` in the Next.js `.env.local` (see the root `.env.example`).
3. Start Laravel with `cd backend && php artisan serve --host=127.0.0.1 --port=8000`.
4. Start Next.js with `npm run dev`.
5. Create the initial admin using `cd backend && php artisan zadland:admin-create`.

The product catalog seeder imports the supplied workbook into MySQL. It does not connect to Supabase or import legacy Supabase records. See [workbook-import.md](workbook-import.md) for the workbook mapping and data repairs.

## Browser/API boundaries

- Public catalog, department, category, brand, home, settings, and sitemap reads come from Laravel.
- Merchant registration and session authentication, wishlist, order history/claiming, and order submission use Laravel.
- Admin data and writes use Laravel endpoints with Sanctum session authentication and the existing permission middleware.
- `/uploads/*` resolves against Laravel's public storage.
- The Next.js API route files are retained for source history, but `beforeFiles` rewrites `/api/*` browser requests to Laravel first. The image proxy is served from `/image-proxy` so it does not overlap the Laravel API.
- The Next.js build no longer runs `prisma generate`; MySQL access belongs to Laravel. The legacy Prisma schema/migrations remain as the earlier phase's migration reference, not the active frontend data connection.
