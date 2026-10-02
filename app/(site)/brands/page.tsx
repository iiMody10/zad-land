import { getCatalogBrands } from "@/lib/catalog";
import BrandsClient from "./BrandsClient";

export const metadata = {
    title: "العلامات التجارية والشركات العالمية | Global Partner Brands - Zad Land",
    description: "استكشف قائمة العلامات التجارية والشركات العالمية الموزعة حصرياً وبأسعار الجملة عبر شركة زاد لاند (أمريكانا، تات، دي سيكو، سانتي، علي كافيه، وغيرها).",
    alternates: {
        canonical: "/brands",
    },
    openGraph: {
        title: "العلامات التجارية المعتمدة | Zad Land",
        description: "استكشف العلامات التجارية والشركات العالمية الموزعة عبر شركة زاد لاند لتجارة المواد الغذائية.",
        url: "/brands",
        images: [
            {
                url: "/logo.png",
                width: 400,
                height: 267,
                type: "image/png",
                alt: "Zad Land logo | شعار زاد لاند",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "العلامات التجارية المعتمدة | Zad Land",
        description: "استكشف العلامات التجارية والشركات العالمية الموزعة عبر شركة زاد لاند لتجارة المواد الغذائية.",
        images: ["/logo.png"],
    },
};

export default async function BrandsPage() {
    const brands = await getCatalogBrands();

    return <BrandsClient brands={brands} />;
}
