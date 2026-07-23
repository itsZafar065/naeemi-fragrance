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
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Start splash screen fade animation at 1.4s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1400);

    // Completely unmount splash screen from DOM at 2.1s
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
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
            console.log("Service Worker registered successfully:", reg.scope);
            
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
          .catch((err) => console.error("Service Worker registration failed:", err));

        return () => {
          navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
        };
      } else {
        // Automatically unregister active service workers in dev mode to prevent HMR infinite loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log("Dev Mode: Active Service Worker unregistered successfully.");
                window.location.reload();
              }
            });
          }
        });
      }
    }
  }, []);

  return (
    <>
      {/* Unified Splash Screen - Theme Matching (Cream & Gold) */}
      {showSplash && (
        <div className={`fixed inset-0 z-[9999] bg-[#faf7f2] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
          fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <div className="text-center space-y-6 animate-fadeIn">
            {/* Theme-matching Logo Container */}
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(212,175,55,0.1)] flex items-center justify-center bg-[#faf7f2]">
              <img
                src="/logo.svg"
                alt="Naeemi Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-1">
              <h2 className="font-extrabold text-xl tracking-widest font-serif text-stone-850 uppercase">
                NAEEMI FRAGRANCE
              </h2>
              <p className="text-amber-600 text-[9px] uppercase font-bold tracking-[0.25em] opacity-90 animate-pulse">
                Naeemi Naam Hai Mohabbat Ka
              </p>
            </div>

            {/* Spinner */}
            <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-600 rounded-full animate-spin mx-auto mt-4" />
          </div>
        </div>
      )}

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
