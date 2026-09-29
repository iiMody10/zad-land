import React, { cache } from 'react';
import { laravelJson } from "@/lib/laravel-server";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductGallery from '@/app/components/ProductDetailsComponents/ProductGallery';
import ProductHeader from '@/app/components/ProductDetailsComponents/ProductHeader';
import ProductPrice from '@/app/components/ProductDetailsComponents/ProductPrice';
import ProductActions from '@/app/components/ProductDetailsComponents/ProductActions';
import ProductAccordions from '@/app/components/ProductDetailsComponents/ProductAccordions';
import ProductShareButtons from '@/app/components/ProductDetailsComponents/ProductShareButtons';
import RelatedProducts from '@/app/components/ProductDetailsComponents/RelatedProducts';
import Breadcrumbs from '@/app/components/ProductDetailsComponents/Breadcrumbs';
import { getI18n } from '@/lib/i18n';
import { canViewWholesalePrices } from '@/lib/price-visibility';

const productImages = (images: unknown): string[] => {
    if (Array.isArray(images)) return images.filter((image): image is string => typeof image === 'string' && image.length > 0);
    if (typeof images !== 'string' || !images) return [];
    try {
        const parsed: unknown = JSON.parse(images);
        if (Array.isArray(parsed)) return parsed.filter((image): image is string => typeof image === 'string' && image.length > 0);
    } catch { /* Older records may contain comma-separated URLs. */ }
    return images.split(',').map((image) => image.trim()).filter(Boolean);
}

export const dynamic = 'force-dynamic';

const getProduct = cache(async (slug: string) => {
    return laravelJson<Record<string, any> | null>(`/api/products/${encodeURIComponent(slug)}`, null, { forwardSession: false });
});

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found | Zad Land',
        };
    }

    const title = `${product.name} | Zad Land - زاد لاند`;
    const brandName = product.brand?.name ? product.brand.name.split('-')[0].trim() : 'Zad Land';
    const description = product.description 
        ? `${product.name} من ${brandName}. متوفر للطلب والبيع بالجملة مع شحن موثوق عبر منصة زاد لاند. ${product.description.slice(0, 120)}`
        : `اشترِ ${product.name} من ${brandName} بأفضل أسعار الجملة المعتمدة من شركة زاد لاند لتجارة وتوزيع المواد الغذائية.`;

    const mainImage = productImages(product.images)[0] || '/logo.jpeg';

    return {
        title,
        description,
        alternates: {
            canonical: `/products/${product.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/products/${product.slug}`,
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [mainImage],
        },
    };
}

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const [{ language }, canViewPrices] = await Promise.all([getI18n(), canViewWholesalePrices()]);

    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    // Related products are optional, so a brief database issue should not
    // prevent the main product details from rendering.
    const relatedResult = await laravelJson<{ products: Record<string, any>[] }>(
        `/api/products?categoryIds=${encodeURIComponent(product.categoryId)}&limit=5`,
        { products: [] },
        { forwardSession: false },
    );
    const relatedProducts = relatedResult.products.filter((item) => item.id !== product.id).slice(0, 4);

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';
    const mainImage = productImages(product.images)[0] || '';

    // Schema.org Product Structured Data
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": displayName,
        "image": mainImage ? [mainImage] : [],
        "description": product.description || displayName,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "Zad Land",
        },
        ...(canViewPrices && product.price != null && !product.pricingNeedsReview ? { "offers": {
            "@type": "Offer",
            "url": `https://zadland.com/products/${product.slug}`,
            "priceCurrency": "USD",
            "price": Number(product.discountPrice || product.price),
            ...(product.stock == null ? {} : { "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }),
            "itemCondition": "https://schema.org/NewCondition",
        } } : {}),
    };

    return (
        <main className="grow w-full mx-auto container-custom !max-w-[1360px] py-4 lg:py-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <Breadcrumbs
                productName={displayName}
                categoryName={product.category?.name}
                categorySlug={product.category?.slug}
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full mt-6">
                {/* Product Gallery (Left) */}
                <div className="w-full lg:w-[58.5%] flex-shrink-0 relative">
                    <ProductGallery
                        images={product.images}
                        isTrending={product.isTrending}
                    />
                </div>

                {/* Product Details (Right) */}
                <div className="w-full lg:w-[41.5%] lg:sticky lg:top-[140px] self-start flex flex-col gap-1">
                    <ProductHeader
                        name={product.name}
                        nameAr={product.nameAr}
                        nameEn={product.nameEn}
                        brandName={product.brand?.name}
                        categoryName={product.category?.name}
                    />

                    <ProductPrice
                        price={canViewPrices && product.price != null ? product.price.toString() : null}
                        discountPrice={canViewPrices ? product.discountPrice?.toString() : null}
                    />

                    <ProductActions
                        product={{
                            id: product.id,
                            name: product.name,
                            nameAr: product.nameAr,
                            nameEn: product.nameEn,
                            price: canViewPrices && product.price != null && !product.pricingNeedsReview ? Number(product.discountPrice || product.price) : null,
                            image: mainImage,
                            slug: product.slug,
                            options: product.options,
                            minOrder: product.minOrder,
                            packaging: product.packaging,
                            itemsPerPackage: product.itemsPerPackage,
                            description: product.description,
                            descriptionAr: product.descriptionAr,
                            descriptionEn: product.descriptionEn,
                            pricingNeedsReview: product.pricingNeedsReview,
                        }}
                        stock={product.stock}
                    />

                    <ProductAccordions 
                        description={product.description}
                        descriptionAr={product.descriptionAr}
                        descriptionEn={product.descriptionEn}
                        options={product.options}
                    />

                    {/* Social Share & Link Sharing */}
                    <ProductShareButtons
                        productName={displayName}
                        productSlug={product.slug}
                    />
                </div>
            </div>

            <RelatedProducts products={relatedProducts.map(p => ({
                ...p,
                price: canViewPrices && p.price != null && !p.pricingNeedsReview ? Number(p.price) : null,
                discountPrice: canViewPrices && p.discountPrice ? Number(p.discountPrice) : null,
                discountType: canViewPrices ? p.discountType : null,
                discountValue: canViewPrices && p.discountValue ? Number(p.discountValue) : null,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                pricingNeedsReview: p.pricingNeedsReview,
            }))} />
        </main>
    );
}

export default ProductPage;
