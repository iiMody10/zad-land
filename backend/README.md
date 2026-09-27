# Zad Land API foundation

This directory is the Laravel 13 backend foundation for the planned migration. Phase 1 adds the Laravel application, its MySQL connection settings, and schema migrations for the 13 application models in `../prisma/schema.prisma`. It does not switch the Next.js frontend off Supabase or move production data.

## Local setup

Requirements: PHP 8.3 or newer with `pdo_mysql`, Composer, and MySQL 8.4.

1. Run `composer install` from this directory.
2. Copy `.env.example` to `.env` and set the local MySQL connection values. Do not reuse these local values in deployment.
3. Create the database named in `DB_DATABASE` with `utf8mb4` and `utf8mb4_0900_ai_ci` defaults.
4. Run `php artisan key:generate` and then `php artisan migrate`.

The migrations create 13 application tables plus Laravel's cache, queue, session, and password-reset infrastructure tables. Application IDs remain string CUIDs; phase 1 deliberately does not invent a new ID generator or convert them to auto-increment values.

The initial migration run was tested against the local MySQL 8.4.0 instance. Before deployment, repeat migration and data-integrity tests against the latest MySQL 8.4.x patch selected for the deployment. As of 2026-09-27, Oracle's 8.4 release notes list 8.4.11 as the latest released patch; local development remains on 8.4.0. See the [MySQL 8.4 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.4/en/) and [download page](https://dev.mysql.com/downloads/mysql/8.4.html).

## Phase 1 boundary

- `docs/schema-contract.md` records the Prisma-to-MySQL type, table, column, index, key, and relationship mapping.
- `docs/supabase-inventory.md` records the 13 Prisma-owned source tables currently known and the Supabase table/bucket inventory still awaiting restored project access.
- Next.js continues using its existing Prisma/Supabase setup. API parity, data export/import, storage migration, and frontend reconnection are later phases.
