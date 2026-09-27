import React from 'react';
import { laravelJson } from "@/lib/laravel-server";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/app/components/ProductDetailsComponents/ProductGallery';
import ProductHeader from '@/app/components/ProductDetailsComponents/ProductHeader';
import ProductPrice from '@/app/components/ProductDetailsComponents/ProductPrice';
import ProductActions from '@/app/components/ProductDetailsComponents/ProductActions';
import ProductAccordions from '@/app/components/ProductDetailsComponents/ProductAccordions';
import RelatedProducts from '@/app/components/ProductDetailsComponents/RelatedProducts';
import { canViewWholesalePrices } from '@/lib/price-visibility';

export const dynamic = 'force-dynamic';

// ProductPageProps removed as it was unused and replaced by inline props

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const [product, canViewPrices] = await Promise.all([
        laravelJson<Record<string, any> | null>(`/api/products/${encodeURIComponent(params.slug)}`, null, { forwardSession: false }),
        canViewWholesalePrices(),
    ]);

    if (!product) {
        notFound();
    }

    // Fetch related products (same category, exclude current)
    const relatedResult = await laravelJson<{ products: Record<string, any>[] }>(
        `/api/products?categoryIds=${encodeURIComponent(product.categoryId)}&brandIds=${encodeURIComponent(product.brandId)}&limit=5`,
        { products: [] }, { forwardSession: false },
    );
    const relatedProducts = relatedResult.products.filter((item) => item.id !== product.id).slice(0, 4);

    const images = Array.isArray(product.images) ? product.images : (() => {
        try { const parsed = JSON.parse(product.images || "[]"); return Array.isArray(parsed) ? parsed : String(product.images || "").split(","); }
        catch { return String(product.images || "").split(","); }
    })();

    return (
        <div className="grow w-full mx-auto px-6 py-8 md:px-20 lg:px-32 xl:px-48 2xl:px-64 lg:py-12">
            
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-12 xl:gap-20">
                {/* Product Gallery (Left) */}
                <div className="lg:col-span-2 order-1">
                    <ProductGallery 
                        images={product.images} 
                        isTrending={product.isTrending} 
                    />
                </div>

                {/* Product Details (Right) */}
                <div className="flex flex-col lg:col-span-3 order-2">
                    {/* Header (Title & Description) - Visible on all screens now */}
                    <div className="block">
                        <ProductHeader
                            name={product.name}
                            nameAr={product.nameAr}
                            nameEn={product.nameEn}
                        />
                        {product.brand && (
                            <Link
                                href={`/brands/${product.brand.slug}`}
                                className="mb-4 mt-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                            >
                                {product.brand.name}
                            </Link>
                        )}
                    </div>
                    
                    <ProductPrice
                        price={canViewPrices ? product.price.toString() : null}
                        discountPrice={canViewPrices ? product.discountPrice?.toString() : null}
                    />

                    <ProductActions product={{
                        id: product.id,
                        name: product.name,
                        nameAr: product.nameAr,
                        nameEn: product.nameEn,
                        price: canViewPrices ? Number(product.discountPrice || product.price) : null,
                        image: images[0] || "",
                        slug: product.slug,
                        options: product.options,
                        minOrder: product.minOrder,
                        packaging: product.packaging,
                        itemsPerPackage: product.itemsPerPackage,
                        description: product.description,
                        descriptionAr: product.descriptionAr,
                        descriptionEn: product.descriptionEn,
                    }} stock={product.stock} />

                    <ProductAccordions 
                        description={product.description}
                        descriptionAr={product.descriptionAr}
                        descriptionEn={product.descriptionEn}
                        options={product.options}
                    />
                </div>
            </div>

            <RelatedProducts products={relatedProducts.map(p => ({
                ...p,
                price: canViewPrices ? Number(p.price) : null,
                discountPrice: canViewPrices && p.discountPrice ? Number(p.discountPrice) : null,
                discountType: canViewPrices ? p.discountType : null,
                discountValue: canViewPrices && p.discountValue ? Number(p.discountValue) : null,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }))} />
        </div>
    );
}

export default ProductPage;
