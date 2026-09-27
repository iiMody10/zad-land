import "server-only";

export async function canViewWholesalePrices() {
    return true;
}

export function projectProductPrices<T extends { price: unknown; discountPrice?: unknown; discountType?: unknown; discountValue?: unknown }>(product: T, allowed: boolean) {
    void allowed;
    return product;
}

export function projectProductsPrices<T extends { price: unknown; discountPrice?: unknown; discountType?: unknown; discountValue?: unknown }>(products: T[], allowed: boolean) {
    return products.map((product) => projectProductPrices(product, allowed));
}
