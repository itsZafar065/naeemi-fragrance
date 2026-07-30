import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { CartProvider } from "@/context/CartContext";
import { LayoutWrapper } from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Naeemi Fragrance | Premium Perfume Store",
  description: "Naeemi Naam Hai Mohabbat Ka. Discover exotic Ouds, floral perfumes, and luxury fragrances.",
  keywords: "perfume store, nextjs, naeemi fragrance, oud, premium scent, mobile fragrance app",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
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
