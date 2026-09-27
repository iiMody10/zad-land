# Phase 2 Laravel API contract

The Laravel API is the single application backend under `/api`. Next.js server rendering calls Laravel directly through the typed server client; browser requests stay same-origin and Next.js rewrites `/api`, `/sanctum/csrf-cookie`, and `/uploads` to Laravel in local development. Production uses the VPS reverse proxy for the same paths.

## First-party session authentication

- Use Sanctum's cookie based SPA flow; do not store bearer tokens in browser storage.
- Before a state-changing request, call `GET /sanctum/csrf-cookie` with credentials enabled, then send the request with credentials and the `X-XSRF-TOKEN` cookie value.
- Requests must come from a host listed in `SANCTUM_STATEFUL_DOMAINS`; CORS origins must match `CORS_ALLOWED_ORIGINS` and allow credentials.
- Merchant endpoints: `/api/customer/auth/{register,login,logout,me}`. Admin endpoints: `/api/admin/auth/{login,logout,me}`. Merchant and admin users use separate Laravel session guards.
- Merchants require admin approval (`isActive`) before login. Admin checks use the existing SUPER_ADMIN role and per-resource `canManage*` / `canDelete*` permissions.

## API areas

- Public catalog: `/api/home`, `/api/products`, `/api/products/{slug}`, `/api/products/trending`, `/api/categories`, `/api/main-categories`, `/api/brands`, `/api/navigation`, `/api/settings`.
- Customer: `/api/customer/orders`, `/api/customer/orders/claim`, `/api/customer/wishlist`.
- Orders: `POST /api/orders`, `GET /api/orders/{id}`; POST accepts product IDs, quantities, and selected options only. MySQL supplies prices; min order quantities, availability, promo status, and stock are validated within one transaction. The required idempotency key replays the original response only for the same request body.
- Admin: `/api/admin/{brands,main-categories,categories,products,banners,promo-codes,orders,customers,reviews,users,settings,credentials,dashboard}` plus `/api/admin/bulk` and `/api/upload`.
- Promo validation: `POST /api/promotions/validate`. Reviews remain unavailable to the public, matching the current app behavior.
- Price fields remain visible in catalog and customer account APIs, matching the current `canViewWholesalePrices()` behavior.

## Frontend integration parity

- The frontend reads and mutates application data through the Laravel API; there are no Next.js Prisma or NextAuth route handlers.
- Next.js server-rendered account pages forward the incoming Laravel session cookie and redirect guests to merchant sign-in.
- Browser API payloads preserve the existing `/api` route shapes. Guest order confirmation uses the signed `orderToken` returned by order creation and Laravel's `zad_order_{id}` cookie for subsequent reads.
- Keep `/api`, `/sanctum/csrf-cookie`, and `/uploads` on the same public origin as the Next.js site so Sanctum cookies and CSRF checks work without cross-origin browser requests.
- The Nginx location example is in `backend/docs/vps-reverse-proxy.example.conf`. Replace the example domain and merge the locations into the current HTTPS virtual host. On the server, set Next.js `LARAVEL_API_URL` to Laravel's private upstream, and set Laravel `APP_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_SECURE_COOKIE=true`, and `CORS_ALLOWED_ORIGINS` to the real storefront origin(s). Use a host-only session cookie unless the apex and `www` hosts both need to share sessions.
- `TRUSTED_PROXIES` must contain the private Nginx proxy address(es), so Laravel correctly detects HTTPS and issues secure order/session cookies. The API upstream should stay private and unreachable directly from the public internet.

Uploads accept raster images up to 10 MB and return a public `/uploads/{folder}/{filename}` path served by Laravel. SVG and other active content are rejected.
