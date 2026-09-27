# Supabase source inventory status

**Status: pending restored Supabase project access.** The current workspace has a Supabase URL and publishable key in its ignored local environment, but no usable project connection is available. The database connection currently fails, and no server-side access credential is configured here. The remote catalog query and Storage bucket listing have therefore not been run. Do not treat this provisional Prisma-derived list as a complete remote Supabase inventory.

## Tables represented by the checked-in Prisma schema

These are the 13 app models currently known from `../prisma/schema.prisma`. PostgreSQL Prisma model names are quoted as written; the later MySQL target names are shown for migration mapping.

| PostgreSQL model/table | MySQL target |
| --- | --- |
| `"User"` | `users` |
| `"Customer"` | `customers` |
| `"MainCategory"` | `main_categories` |
| `"Category"` | `categories` |
| `"Product"` | `products` |
| `"Brand"` | `brands` |
| `"Order"` | `orders` |
| `"Banner"` | `banners` |
| `"PromoCode"` | `promo_codes` |
| `"OrderItem"` | `order_items` |
| `"WishlistItem"` | `wishlist_items` |
| `"Settings"` | `settings` |
| `"Review"` | `reviews` |

## Still to inventory once access is restored

1. Query PostgreSQL catalogs for all non-system schemas, tables, views, enums, indexes, constraints, triggers, and sequences; compare the result with the 13 Prisma models and record any Supabase-managed versus app-owned objects separately.
2. List all Supabase Storage buckets, access policies, and object counts. Record bucket names, public/private status, object paths, and dependencies; do not copy bucket contents during phase 1.
3. Record the discovery date and source project identity without storing credentials in this document.

This inventory is a phase-1 prerequisite for the later data extraction/import phase. Until it is complete, no assertion is made that all Supabase tables or Storage buckets have been found.
