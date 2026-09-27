# Prisma to Laravel/MySQL schema contract

**Source of truth:** `../prisma/schema.prisma` in the repository root. The phase-1 migrations describe that checked-in schema; they are not a claim that every remote Supabase object has been inventoried.

## Naming

The PostgreSQL Prisma tables use the model names as written (for example, `"MainCategory"` and `"OrderItem"`). Laravel uses conventional lowercase plural snake-case table names. Fields use snake case in MySQL; Prisma camel-case fields become snake case (`mainCategoryId` → `main_category_id`). The source field `Order.Name` becomes `orders.name`. The 13 model/table mappings are:

| Prisma model / PostgreSQL table | Laravel / MySQL table |
| --- | --- |
| `User` | `users` |
| `Customer` | `customers` |
| `MainCategory` | `main_categories` |
| `Category` | `categories` |
| `Product` | `products` |
| `Brand` | `brands` |
| `Order` | `orders` |
| `Banner` | `banners` |
| `PromoCode` | `promo_codes` |
| `OrderItem` | `order_items` |
| `WishlistItem` | `wishlist_items` |
| `Settings` | `settings` |
| `Review` | `reviews` |

## PostgreSQL → MySQL types

| Prisma/PostgreSQL type | MySQL 8.4 mapping | Notes |
| --- | --- | --- |
| `String` / PostgreSQL `text` | `LONGTEXT` for unbounded text; `VARCHAR` for primary, unique, foreign-key, and indexed-name columns | MySQL 8.4 does not allow defaults on `TEXT`/`LONGTEXT`. The singleton settings row is seeded with the Prisma text defaults so all settings columns can remain unbounded `LONGTEXT`; the small product packaging and banner text defaults use `VARCHAR(1024)`. Indexed fields use explicit lengths that fit InnoDB's 3072-byte key limit. Validate source lengths before importing data; see limits below. |
| `String @id` with `cuid()` | `VARCHAR(191)` primary key, `utf8mb4_0900_bin` | IDs remain strings and imports preserve them. `cuid()` is a Prisma-client default, not a PostgreSQL server default; the Laravel app must generate compatible IDs in a later phase. |
| `Boolean` | `BOOLEAN` | MySQL's boolean alias is `TINYINT(1)`. Defaults and nullability match Prisma. |
| `Int` | `INT` | Signed, matching Prisma's default integer mapping. |
| `Decimal @db.Decimal(10,2)` | `DECIMAL(10,2)` | Keeps the source precision and scale for product/order prices, discounts, promo sales, and exchange rate. |
| `DateTime` | `DATETIME(3)` | Preserves millisecond precision without MySQL `TIMESTAMP`'s narrower date range. `created_at` keeps the source database `now()` default; `updated_at` is supplied by the application, as Prisma `@updatedAt` is client-managed. |
| Prisma enums | MySQL `ENUM` | Values and defaults are copied exactly: `OrderStatus`, `Role`, and `BrandGroup`. Enum columns use a binary collation for exact value matching. |

The `users.password` and `customers.password` columns remain `VARCHAR(255)` for the existing password-hash strings. The migration does not transform passwords; a later data copy must preserve each stored hash verbatim.

### Indexed string limits and comparison behavior

MySQL InnoDB limits an index key to 3072 bytes. Single-column unique text fields use `VARCHAR(767)` with `utf8mb4_0900_bin`; the compound `categories(brand_id, name)` key uses 191 characters for each component. IDs and their foreign keys use matching `VARCHAR(191)` definitions. `customers.phone` uses `VARCHAR(64)`. Product packaging and banner text fields with short defaults use `VARCHAR(1024)`. The singleton `settings` row is seeded with Prisma's string defaults because MySQL cannot put defaults on `LONGTEXT`, while retaining unbounded text columns. Indexed limits are well above current application-generated CUIDs and typical names, slugs, usernames, phone numbers, and idempotency keys, but PostgreSQL `text` itself is unbounded. Before phase-2 import, check source values against these limits and resolve any over-length rows before inserting them.

The `_0900_bin` collation keeps unique strings case-sensitive, matching PostgreSQL's normal text `UNIQUE` behavior. This applies to usernames, names/slugs, promo codes, phone numbers, idempotency keys, and the category brand/name pair. The nullable unique idempotency key allows multiple `NULL` values, as in PostgreSQL.

## Relationships and delete behavior

Foreign keys are created after their parent tables. Prisma's default `onUpdate: Cascade` is preserved throughout. For delete behavior, optional relations default to `SetNull`, required relations default to `Restrict`, and explicit cascades are preserved:

| Child column | Parent column | Delete behavior |
| --- | --- | --- |
| `brands.main_category_id` | `main_categories.id` | Set null (optional source relation default) |
| `categories.brand_id` | `brands.id` | Restrict (source default) |
| `categories.main_category_id` | `main_categories.id` | Set null (optional source relation default) |
| `products.brand_id` | `brands.id` | Restrict (source default) |
| `products.category_id` | `categories.id` | Restrict (source default) |
| `products.main_category_id` | `main_categories.id` | Set null (optional source relation default) |
| `orders.customer_id` | `customers.id` | Set null (optional source relation default) |
| `orders.promo_code_id` | `promo_codes.id` | Set null (optional source relation default) |
| `order_items.order_id` | `orders.id` | Cascade |
| `order_items.product_id` | `products.id` | Restrict (source default) |
| `wishlist_items.customer_id` | `customers.id` | Cascade |
| `wishlist_items.product_id` | `products.id` | Cascade |
| `reviews.product_id` | `products.id` | Cascade |

## Unique keys and indexes

Migrations preserve every Prisma unique constraint and `@@index` declaration:

- `users.username`, `customers.phone`
- `main_categories.name`, `main_categories.slug`
- `categories.slug`, and `(brand_id, name)`
- `products.slug`
- `brands.name`, `brands.slug`
- nullable `orders.idempotency_key`
- `promo_codes.code`
- `(wishlist_items.customer_id, product_id)`
- All model `@@index` entries in the Prisma schema, including the product catalog/search indexes and review/customer indexes.

Laravel's standard `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `sessions`, and `password_reset_tokens` tables are framework infrastructure, not additional migrated Supabase models. The session `user_id` column is a string to match the `users.id` type.
