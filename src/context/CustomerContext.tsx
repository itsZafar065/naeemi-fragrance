"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; email?: string; error?: string }>;
  signup: (name: string, email: string, password: string, phone: string, address: string) => Promise<{ success: boolean; needsVerification?: boolean; email?: string; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string, address: string) => Promise<{ success: boolean; error?: string }>;
  verifySignup: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string, type: "email_verification" | "forgot_password", name?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, otp: string, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Check customer session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/customer/auth");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setCustomer(data.customer);
          }
        }
      } catch (err) {
        console.error("Failed to load customer session:", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.needsVerification) {
          return { success: true, needsVerification: true, email: data.email };
        }
        setCustomer(data.customer);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (err) {
      return { success: false, error: "Network or Server error. Please try again." };
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string, address: string) => {
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", name, email, password, phone, address }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.needsVerification) {
          return { success: true, needsVerification: true, email: data.email };
        }
        setCustomer(data.customer);
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (err) {
      return { success: false, error: "Network or Server error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/customer/logout", { method: "POST" });
      setCustomer(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const updateProfile = async (name: string, phone: string, address: string) => {
    try {
      const response = await fetch("/api/customer/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCustomer(data.customer);
        return { success: true };
      }
      return { success: false, error: data.error || "Update failed" };
    } catch (err) {
      return { success: false, error: "Network or Server error." };
    }
  };

  const verifySignup = async (email: string, otp: string) => {
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_signup", email, otp }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCustomer(data.customer);
        return { success: true };
      }
      return { success: false, error: data.error || "Verification failed." };
    } catch (err) {
      return { success: false, error: "Network or Server error." };
    }
  };

  const sendOtp = async (email: string, type: "email_verification" | "forgot_password", name?: string) => {
    try {
      const response = await fetch("/api/customer/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type, name }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to dispatch verification code." };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword?: string) => {
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || "Password reset failed." };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        verifySignup,
        sendOtp,
        resetPassword,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
