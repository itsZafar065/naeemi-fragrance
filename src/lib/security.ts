import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// Simple in-memory maps for production rate limiting and brute force protection (reloaded on HMR)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const ipRequests = new Map<string, { count: number; resetTime: number }>();

// 1. Rate Limiting Helper (Standard API limits)
export function rateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  record.count += 1;
  if (record.count > limit) {
    return false; // Rate limit exceeded
  }
  return true;
}

// 2. Brute-Force Login Protection
export function checkBruteForce(email: string): { allowed: boolean; waitTimeMinutes?: number } {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (record && record.lockUntil > now) {
    const remainingMs = record.lockUntil - now;
    return {
      allowed: false,
      waitTimeMinutes: Math.ceil(remainingMs / 60000),
    };
  }

  return { allowed: true };
}

export function registerFailedAttempt(email: string) {
  const now = Date.now();
  const record = loginAttempts.get(email) || { count: 0, lockUntil: 0 };

  record.count += 1;
  if (record.count >= 5) {
    record.lockUntil = now + 15 * 1000; // 15-second lock on 5 failed attempts (temporary for testing)
    record.count = 0; // reset counter after locking
  }
  loginAttempts.set(email, record);
}

export function resetFailedAttempts(email: string) {
  loginAttempts.delete(email);
}

// 3. NoSQL Injection Sanitizer
// Strips keys starting with '$' to prevent MongoDB operators injection
export function sanitizeInput(input: any): any {
  if (input instanceof Array) {
    return input.map(sanitizeInput);
  }
  if (input !== null && typeof input === "object") {
    const cleanObj: any = {};
    for (const key in input) {
      if (!key.startsWith("$")) {
        cleanObj[key] = sanitizeInput(input[key]);
      }
    }
    return cleanObj;
  }
  return input;
}

// 4. Secure password input patterns verification
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Min 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}
