"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNavigation } from "./BottomNavigation";
import { CartDrawer } from "./CartDrawer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
          .catch((err) => console.error("Service Worker registration failed:", err));
      } else {
        // Automatically unregister active service workers in dev mode to prevent HMR infinite loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log("Dev Mode: Active Service Worker unregistered successfully.");
                // Hard reload once to clear cached pages completely
                window.location.reload();
              }
            });
          }
        });
      }
    }
  }, []);

  if (isAdmin) {
    return (
      <main className="min-h-screen w-full bg-[#faf7f2] p-4 md:p-8">
        {children}
      </main>
    );
  }

  return (
    <>
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

      {/* Shopping Cart Drawer */}
      <CartDrawer />
    </>
  );
}
