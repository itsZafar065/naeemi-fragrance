import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { CartProvider } from "@/context/CartContext";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Naeemi Fragrance | Premium Perfume Store",
    template: "%s | Naeemi Fragrance",
  },
  description: "Naeemi Naam Hai Mohabbat Ka. Discover exotic Ouds, floral perfumes, and luxury fragrances.",
  keywords: "perfume store, nextjs, naeemi fragrance, oud, premium scent, mobile fragrance app",
  applicationName: "Naeemi Fragrance",
  authors: [{ name: "Naeemi Fragrance" }],
  creator: "Naeemi Fragrance",
  publisher: "Naeemi Fragrance",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Naeemi Fragrance",
    title: "Naeemi Fragrance | Premium Perfume Store",
    description: "Naeemi Naam Hai Mohabbat Ka. Discover exotic Ouds, floral perfumes, and luxury fragrances.",
    images: [{ url: "/heroimg.webp", width: 1200, height: 630, alt: "Naeemi Fragrance premium perfume bottle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naeemi Fragrance | Premium Perfume Store",
    description: "Naeemi Naam Hai Mohabbat Ka. Discover exotic Ouds, floral perfumes, and luxury fragrances.",
    images: ["/heroimg.webp"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col pb-24 md:pb-0 bg-[#faf7f2]">
        <AdminProvider>
          <CustomerProvider>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </CustomerProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
