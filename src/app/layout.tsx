import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { CartProvider } from "@/context/CartContext";


const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

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

import { LayoutWrapper } from "@/components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0 bg-[#faf7f2]">
        <AdminProvider>
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
