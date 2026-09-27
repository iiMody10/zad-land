# Product workbook import

`database/seeders/data/workbook-products.json` is the normalized product source extracted from the supplied `زاد لاند نهائي .xlsx` workbook. Run `php artisan db:seed --class=ProductCatalogSeeder` (or `php artisan db:seed`) after migrations to create catalog records. The seeder is safe to rerun: it creates missing catalog records and does not reset stock or overwrite edits on existing products.

The source contained 544 products. Import normalization:

- The main-category spelling `مفزرات` was grouped with `مفرزات`; leading/trailing whitespace in category labels was trimmed.
- 187 price cells were stored by Excel as dates with `m.d` or `mm.dd` formats. Their displayed values were preserved as USD prices (for example, January 20 became `1.20`); the original sheet's exchange-rate settings still control display in SYP.
- Three fractional quantities were floored to whole cartons because MySQL `products.stock` is an integer and represents available cartons. One blank quantity became zero stock.
- Three products with no brand are assigned to the `عام` brand. Twenty-nine products with no valid image URL keep an empty image list and use the storefront placeholder.
- The workbook had no minimum-quantity or per-package data, so product defaults remain one carton and the existing `طرد` packaging unit.

The product workbook does not contain merchant accounts, orders, promotions, admin users, banners, site settings, or favorites. Those records are intentionally not backfilled from Supabase in this phase.

## Priced catalog and barcode images

`database/seeders/data/priced-workbook-products.json` contains the 537 products from `زاد لاند نهائي كامل مسعر.xlsx`. Each row's barcode is stored in the product `sku` field and its image is set to `/uploads/products/catalog-batch/{barcode}.webp`.

Import with `php artisan db:seed --class=PricedProductCatalogSeeder`. The seeder updates existing products matched by barcode or an unambiguous Arabic/English product name under the same brand, and creates products not already in the catalog. It is safe to rerun by barcode and does not delete products missing from the workbook. The workbook's `m.d` date-formatted price cells are normalized as decimal prices; blank stock is zero and fractional carton quantities are floored to whole cartons. One product without a brand is assigned to `عام`.

To create the first admin after deployment, run `php artisan zadland:admin-create`; it prompts for a username and password without storing credentials in shell history.
