import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

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
};

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
            {/* Desktop Navbar */}
            <Navbar />

            {/* Main Application Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
              {children}
            </main>

            {/* Persistent Global Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <BottomNavigation />

            {/* Shopping Cart Sidebar */}
            <CartDrawer />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
