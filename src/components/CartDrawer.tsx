"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";
import { X, Trash2, ShoppingBag, ShieldCheck, Plus, Minus } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { placeOrder } = useAdmin();

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    // Map cart to order items
    const orderItems = cart.map((item) => ({
      perfumeId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Create an order ID for reference
    const tempOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(tempOrderId);

    // Call AdminContext state mutation
    placeOrder(name, phone, address, orderItems, cartTotal);

    // Reset states
    setOrderSuccess(true);
    clearCart();
    setIsCheckingOut(false);
    setName("");
    setPhone("");
    setAddress("");
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setOrderSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full glass-panel flex flex-col shadow-2xl z-10 border-l border-white/40">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-lg text-stone-800">Your Fragrance Box</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center text-center h-full space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-800">Order Placed Securely!</h3>
              <p className="text-stone-600 text-sm">
                Thank you for choosing Naeemi Fragrance. Your order <span className="font-semibold text-amber-600">{orderId}</span> has been received.
              </p>
              <p className="text-xs text-stone-400 italic">"Naeemi Naam Hai Mohabbat Ka"</p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl gold-btn w-full font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full space-y-4 text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 stroke-[1.5]" />
              <p className="text-sm font-medium">Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 rounded-xl border border-amber-500/30 text-amber-700 bg-amber-50/40 hover:bg-amber-50 text-sm font-semibold transition-all"
              >
                Discover Fragrances
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Secure Checkout Form */
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Secure COD Checkout.</span> Please enter shipping details below to place your order.
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Nawaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 block">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  placeholder="House number, Street name, Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-stone-200/50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl gold-btn font-medium text-sm text-white"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          ) : (
            /* Items List */
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-white/50 border border-white/60 rounded-2xl"
                >
                  {/* Miniature Product Image Representation */}
                  <div
                    className="w-16 h-16 rounded-xl shrink-0 border border-white/40"
                    style={{ background: item.product.imageUrl }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-800 text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {item.product.volume} • {item.product.type}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white/50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-500 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-700 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-500 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-stone-800">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="self-start p-1 text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!orderSuccess && cart.length > 0 && !isCheckingOut && (
          <div className="p-5 border-t border-stone-200/50 bg-white/30 space-y-4">
            <div className="flex justify-between items-center text-stone-800">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-xl font-bold">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-xl gold-btn font-semibold text-center text-sm shadow-md"
            >
              Proceed to Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
