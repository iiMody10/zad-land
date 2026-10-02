import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { getI18n } from "@/lib/i18n";
import { canViewWholesalePrices } from "@/lib/price-visibility";

const metadataBase =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.zad-land.com";

export const viewport: Viewport = {
  themeColor: "#072835",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: {
    default: "Zad Land | Wholesale Food & Goods Trading - زاد لاند لتجارة وتوزيع المواد الغذائية",
    template: "%s",
  },
  description:
    "شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة في سوريا. توريد معتمد من علامات عالمية للمتاجر وأصحاب الأعمال.",
  keywords: [
    "Zad Land",
    "زاد لاند",
    "تجارة جملة مواد غذائية",
    "توزيع مواد غذائية سوريا",
    "استيراد مواد غذائية",
    "عروض جملة",
    "أمريكانا جملة",
    "تات معجون طماطم",
    "دي سيكو باستا",
    "سانتي حبوب إفطار",
    "علي كافيه جملة",
    "مواد استهلاكية جملة",
    "تجار جملة دمشق",
    "wholesale food distributor",
    "FMCG wholesale Syria",
    "food importer",
    "bulk food supply",
    "Americana wholesale",
    "Tat wholesale",
    "De Cecco wholesale",
    "grocery wholesale B2B"
  ],
  authors: [{ name: "Zad Land", url: metadataBase }],
  creator: "Zad Land",
  publisher: "Zad Land",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_SY",
    alternateLocale: ["en_US", "ar_SA"],
    siteName: "Zad Land | زاد لاند",
    title: "Zad Land | Wholesale Food & Goods Trading - زاد لاند",
    description:
      "شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة في سوريا، وتوريد معتمد للمتاجر وأصحاب الأعمال.",
    url: metadataBase,
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
    title: "Zad Land | Wholesale Food & Goods Trading - زاد لاند",
    description:
      "شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة في سوريا، وتوريد معتمد للمتاجر وأصحاب الأعمال.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  category: "food & beverage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ language, dir }, priceVisible] = await Promise.all([
    getI18n(),
    canViewWholesalePrices(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "name": "Zad Land - زاد لاند",
    "url": metadataBase,
    "logo": `${metadataBase}/logo.png`,
    "image": `${metadataBase}/logo.png`,
    "description": "شركة زاد لاند لتجارة وتوزيع المواد الغذائية والمنتجات الاستهلاكية بالجملة.",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Bank Transfer",
    "areaServed": "Syria",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SY"
    }
  };

  return (
    <html lang={language} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Figtree:wght@300..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/admin/*" } },
                      { not: { href_matches: "/api/*" } },
                    ],
                  },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <div id="app-shell">
          <Providers initialLanguage={language} priceVisible={priceVisible}>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
