"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Perfume } from "./AdminContext";

export interface CartItem {
  product: Perfume;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Perfume, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("naeemi_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem("naeemi_wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("naeemi_cart", JSON.stringify(updatedCart));
  };

  const saveWishlist = (updatedWishlist: string[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("naeemi_wishlist", JSON.stringify(updatedWishlist));
  };

  const addToCart = (product: Perfume, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    saveCart(updatedCart);
    setIsCartOpen(true); // Open cart sidebar on add
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const isFav = wishlist.includes(productId);
    let updatedWishlist: string[];

    if (isFav) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }

    saveWishlist(updatedWishlist);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
