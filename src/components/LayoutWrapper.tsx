"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNavigation } from "./BottomNavigation";
import { CartDrawer } from "./CartDrawer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/naeemi-fragrance-secure-vault-admin-portal");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user has previously dismissed the install prompt
      if (typeof window !== "undefined" && localStorage.getItem("pwa-install-dismissed") !== "true") {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const dismissInstallBanner = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
    setShowInstallBanner(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
    setShowInstallBanner(false);
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        let refreshing = false;
        const handleControllerChange = () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        };
        navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check if there is an updated service worker waiting
            if (reg.waiting) {
              reg.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            // Listen for new service worker installs
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                    installingWorker.postMessage({ type: "SKIP_WAITING" });
                  }
                };
              }
            };
          })
          .catch(() => console.error("Service Worker registration failed."));

        return () => {
          navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
        };
      } else {
        // Automatically unregister active service workers in dev mode to prevent HMR infinite loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    }
  }, []);

  return (
    <>
      {/* Dynamic PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 p-4 bg-[#1c1917] border border-amber-500/30 text-white rounded-2xl shadow-2xl flex flex-col gap-3 animate-fadeIn text-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">App Available</span>
              <h4 className="font-bold text-xs">Install Naeemi Fragrance App</h4>
              <p className="text-[10px] text-stone-300">Enjoy offline tracking and faster checkouts on your mobile screen!</p>
            </div>
            <button 
              onClick={dismissInstallBanner}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer"
            >
              Install App
            </button>
            <button
              onClick={dismissInstallBanner}
              className="px-4 py-2 border border-stone-700 hover:bg-stone-800 text-stone-300 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {isAdmin ? (
        <main className="min-h-screen w-full bg-[#faf7f2] p-4 md:p-8 animate-fadeIn">
          {children}
        </main>
      ) : (
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
      )}
    </>
  );
}
